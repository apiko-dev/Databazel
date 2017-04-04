import moment from 'moment';
import color from '/lib/colors';
import { chartTypeRules, maxStringLengthOnChart } from '/lib/constants.js';
import { _ } from 'meteor/underscore';

export default {
  process(rawData, fields) {
    let data = rawData;
    if (!rawData) return null;
    const dateField = fields.find((field) => field.currentType === 'date');
    if (dateField) data = this.processDate(data, dateField);
    return data;
  },

  chart(rawData, fields, chartType) {
    if (chartType === 'scatter') {
      return this.scatterChart(rawData, fields, chartType);
    }
    return this.othersChart(rawData, fields, chartType);
  },

  othersChart(rawData, fields, chartType) {
    const dimensions = this.filterFields('dimensions', fields, chartType);
    const measures = this.filterFields('measures', fields, chartType);
    const dName = dimensions[0] && dimensions[0].name;
    const couldQueryBeStacked = this.couldQueryBeStacked(fields, chartType);
    const isStacked = couldQueryBeStacked && this.isSelectedToBeStacked(fields, chartType);
    const options = {};
    let labels = rawData.map(item => crop(item[dName]));
    let datasets;

    if (isStacked) {
      options.scales = { xAxes: [{ stacked: true }], yAxes: [{ stacked: true }] };
      labels = _.uniq(labels);
      datasets = this.getStackedDatasets(rawData, labels, dimensions, measures, fields);
    } else {
      let rawDataFull;
      if (couldQueryBeStacked) {
        labels = _.uniq(labels);
        const dims = dName ? [dimensions[0].name] : [];
        const fieldExpression = fields.find(f => f.name === measures[0].name).expression;
        const aggFunc = fieldExpression.match(/avg|sum|min|max|count/i)[0];
        rawDataFull = this.getSubTotals(rawData, aggFunc, dims, measures[0].name);
      } else rawDataFull = rawData;
      datasets = measures.map(measure => {
        const data = rawDataFull.map(item => item[measure.name]);
        return { data, label: crop(measure.name) };
      });
    }
    addBackgroundColors(datasets, chartType);

    return {
      data: { labels, datasets },
      options,
    };
  },

  isSelectedToBeStacked(fields, chartType) {
    let dimensionsCount = 0;
    let measuresCount = 0;
    fields.forEach(f => {
      if (f.constructorType === 'dimensions') dimensionsCount++;
      else if (f.constructorType === 'measures') measuresCount++;
    });
    return dimensionsCount > 1 && measuresCount > 0 && /bar|line|radar/i.test(chartType);
  },

  couldQueryBeStacked(fields) {
    return fields.length > 2 &&
      !fields.filter(f => !/AVG|MAX|MIN|SUM|COUNT/i.test(f.expression) && !f.grouping).length;
  },

  getStackedDatasets(rawData, labels, dimensions, measures, fields) {
    const dim1Name = dimensions[0].name;
    const dim2Name = dimensions[1].name;
    const measureName = measures[0].name;
    const subFields = _.difference(fields.map(f => f.name), [dim1Name, dim2Name, measureName]);
    let fullRawData;
    if (subFields.length) {
      const dims = [dim1Name, dim2Name];
      const aggFunc = fields.find(f => f.name === measureName).expression
        .match(/avg|sum|min|max|count/i)[0];
      fullRawData = this.getSubTotals(rawData, aggFunc, dims, measureName);
    } else fullRawData = rawData;

    const datasets = {};

    fullRawData.forEach(item => {
      const datasetName = crop(item[dim2Name]);
      const mainDim = crop(item[dim1Name]);
      if (!datasets[datasetName]) datasets[datasetName] = {};
      datasets[datasetName][mainDim] = item[measureName];
    });
    return _.map(datasets, (dataset, label) => {
      const data = labels.map(dimLabel => getNumber(dataset[dimLabel]));
      return { data, label };
    });
  },

  getSubTotals(data, aggFunc, dims, measure) {
    const res = {};
    data.forEach(d => {
      const key = _.values(_.pick(d, dims)).map(f => String(f)).join('ՖՖՖ');
      if (!res[key]) res[key] = _.pick(d, dims.concat(measure));
      else res[key][measure] = this.aggregate([res[key][measure], d[measure]], aggFunc);
    });
    return _.values(res);
  },

  scatterChart(rawData, fields) {
    const x = this.filterFields('x', fields, 'scatter');
    const y = this.filterFields('y', fields, 'scatter');
    const xName = x[0] && x[0].name;
    let options = {
      maintainAspectRatio: false,
      responsive: true,
    };

    if (y && y.length > 1) {
      options = { scales: {
        yAxes: [
          { id: 0 },
          { id: 1, position: 'right' },
        ],
      } };
    }

    const datasets = y && y.map((yItem, i) => (
      {
        label: yItem.name,
        yAxisID: options.scales ? i : null,
        backgroundColor: color(i + 1, 0.7),
        data: rawData.map(item => ({ x: item[xName], y: item[yItem.name], r: 0 })),
      }
    ));

    return { data: { datasets }, options };
  },

  EChart(rawData, fields, chartType) {
    let dimensions;
    let measures;
    let option;

    if (chartType !== 'scatter') {
      dimensions = this.filterFields('dimensions', fields, chartType);
      measures = this.filterFields('measures', fields, chartType);
    }
    if (chartType === 'line' || chartType === 'bar') {
      option = this.getBarLine(dimensions, measures, rawData, chartType);
    }
    if (chartType === 'pie' || chartType === 'funnel') {
      option = this.getPieFunnel(dimensions, measures, rawData, chartType);
    }
    if (chartType === 'scatter') {
      option = this.getScatter(rawData, fields);
    }
    return option;
  },

  filterFields(fieldType, fields, chartType) {
    const selectedFields = fields.filter(field => field.constructorType === fieldType);
    return selectedFields.slice(0, chartTypeRules[chartType][fieldType]);
  },

  getBarLine(dimensions, measures, rawData, chartType) {
    const legendData = measures.map(field => field.name);
    const series = legendData.map(name => {
      const data = rawData.map(item => item[name]);
      return { type: chartType, name, data };
    });

    return {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: legendData,
        orient: 'horizontal',
        x: 'center',
        y: 'top',
      },
      xAxis: [{
        data: rawData.map(item => item[dimensions[0].name]),
        boundaryGap: chartType !== 'line',
        type: 'category',
        show: true,
      }],
      yAxis: [{
        type: 'value',
        show: true,
      }],
      series,
    };
  },

  getPieFunnel(dimensions, measures, rawData, chartType) {
    const dimName = dimensions[0].name;
    const measName = measures[0].name;
    const seriesData = rawData.map(item => (
      { value: item[measName], name: item[dimName] }
    ));

    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        data: chartType === 'pie' ? rawData.map(item => item[dimName]) : '',
        orient: 'vertical',
        x: 'left',
        y: 'center',
      },
      xAxis: [{
        show: false,
      }],
      yAxis: [{
        show: false,
      }],
      series: [{
        width: chartType === 'pie' ? '100%' : '60%',
        name: measName,
        type: chartType,
        data: seriesData,
      }],
    };
  },

  getScatter(rawData, fields) {
    const x = this.filterFields('x', fields, 'scatter');
    const y = this.filterFields('y', fields, 'scatter');
    const xName = x[0] && x[0].name;
    const yName = y[0] && y[0].name;
    const data = rawData.map(item => [item[xName], item[yName]]);

    return {
      tooltip: {
        trigger: 'axis',
      },
      xAxis: [{ type: 'value' }],
      yAxis: [{ type: 'value' }],
      series: [{
        name: '女性',
        type: 'scatter',
        data,
      }],
    };
  },

  processDate(data, dateField) {
    const datePart = _.keys(data[0]).filter((prop) => prop.slice(0, 1) === '_');
    const isMonth = !!~datePart.indexOf('_month');

    if (!datePart || !datePart.length) return data;
    const dateFormat = getDateFormat(dateField.grouping);

    return data.map((item) => {
      const dateValues = _.values(_.pick(item, datePart));
      if (isMonth) dateValues.splice(1, 1, dateValues[1] - 1);
      item[dateField.name] = getDateString(dateValues, dateFormat, dateField.grouping);
      return item;
    });
  },

  createPivotData({ data, fields, model, sorting, pivotColsHeaders }) {
    const { columns = [], rows = [], values = [] } = model;
    if (!rows.length && !values.length) return [];
    const rowsNames = rows.map(fieldId => _.find(fields, f => f.id === fieldId).name);
    const colsNames = columns.map(fieldId => _.find(fields, f => f.id === fieldId).name);
    const dataKeys = data.map(d => {
      const t = _.clone(d);
      t.COL_KEY = colsNames[0] ? esc(t[colsNames[0]]) : 'ROW_TOTAL';
      for (let i = 1; i < colsNames.length; i++) {
        t.COL_KEY += `ՖՖՖ${esc(t[colsNames[i]])}`;
      }
      t.ROW_KEY = esc(t[rowsNames[0]]);
      for (let i = 1; i < rowsNames.length; i++) {
        t.ROW_KEY += `ՖՖՖ${esc(t[rowsNames[i]])}`;
      }
      return t;
    });
    const dataArray = [];
    _.uniq(dataKeys.map(d => d.ROW_KEY)).forEach(rowKey => {
      const row = {};
      dataKeys.filter(d => d.ROW_KEY === rowKey).forEach((d, i) => {
        row[d.COL_KEY] = _.values(_.omit(d, _.union(
          colsNames, rowsNames, 'KEY', 'COL_KEY', 'ROW_KEY'
        )))[0];
        if (!i) _.extend(row, _.pick(d, rowsNames));
      });
      row.ROW_KEY = rowKey;
      dataArray.push(row);
    });
    const dataMap = [];
    if (rowsNames.length <= 1) dataMap.push.apply(dataMap, dataArray);
    if (rowsNames.length > 1) {
      _.uniq(dataArray.map(row1 => row1[rowsNames[0]])).forEach(row1Val => {
        const rowGroup = dataArray.filter(row2 => row2[rowsNames[0]] === row1Val);
        rowGroup.val = row1Val;
        dataMap.push(rowGroup);
      });
    }
    if (rowsNames.length > 2) {
      dataMap.forEach((row1, i) => {
        dataMap[i] = [];
        dataMap[i].val = row1.val;
        _.uniq(row1.map(col => col[rowsNames[1]])).forEach(col2Val => {
          const colGroup2 = row1.filter(col => col[rowsNames[1]] === col2Val);
          colGroup2.val = col2Val;
          dataMap[i].push(colGroup2);
        });
      });
    }
    const totaledData = addTotals({ dataMap, fields, model, pivotColsHeaders });
    const sortedData = sortData({ totaledData, fields, model, sorting });
    return sortedData;
  },

  createPivotColsHeaders(data, fields, { columns }) {
    if (!columns || !columns.length) return [];
    // Todo Oleg: refactor && optimize (sorting)
    const colsNames = columns.map(fieldId => _.find(fields, f => f.id === fieldId).name);
    const dataKeyed = data.map(h => {
      const d = _.clone(h);
      d.KEY = esc(d[colsNames[0]]);
      for (let i = 1; i < colsNames.length; i++) {
        d.KEY += `ՖՖՖ${esc(d[colsNames[i]])}`;
      }
      return d;
    });
    const columnsArray = _.uniq(dataKeyed.map(d => d.KEY))
      .map(key => {
        const values = key.split('ՖՖՖ');
        const column = {};
        colsNames.forEach((name, i) => { column[name] = values[i]; });
        return column;
      });

    const columnsMap = [];

    if (colsNames.length === 1) columnsMap.push.apply(columnsMap, columnsArray);
    if (colsNames.length > 1) {
      _.uniq(columnsArray.map(col1 => col1[colsNames[0]])).forEach(col1Val => {
        const colGroup = columnsArray.filter(col2 => col2[colsNames[0]] === col1Val);
        colGroup[0].colGroup1Value = col1Val;
        columnsMap.push(colGroup);
      });
    }
    if (colsNames.length > 2) {
      columnsMap.forEach((col1, i) => {
        columnsMap[i] = [];
        _.uniq(col1.map(col => col[colsNames[1]])).forEach(col2Val => {
          const colGroup2 = col1.filter(col => col[colsNames[1]] === col2Val);
          colGroup2[0].colGroup2Value = col2Val;
          colGroup2[0].colGroup1Value = col1[0].colGroup1Value;
          columnsMap[i].push(colGroup2);
        });
      });
    }
    return columnsMap;
  },

  aggregate(valuesArr, aggFunc) {
    let total;
    valuesArr.forEach(val => {
      total = addToTotal(total, val, aggFunc);
    });
    return total;
  },

  imageProcessData(chart) {
    const { viewObject: { data, chartType }, queryObject: { fields }, chartName } = chart;
    const processedChart = this.chart(data, fields, chartType);
    return {
      chartData: processedChart.data,
      options: processedChart.options,
      chartType,
      chartId: chart._id,
      chartName,
    };
  },

  reEscapeCharacters(arg) {
    return reEsc(arg);
  },

  formatNumber(arg, template = '') {
    if (!template.length) return arg;
    if (typeof +arg !== 'number') return 'not number';
    if (isNaN(+arg) || (+arg === 0 && arg !== 0)) return '';
    return template.replace(/^(_*)\.(#*)/, (foo, s1, s2) => {
      const ten = s1.length;
      const devided = ten ? +arg / Math.pow(10, ten) : +arg;
      const dec = s2.length;
      const tenPow = Math.pow(10, dec);
      return (Math.round(devided * tenPow) / tenPow).toFixed(dec);
    });
  },

  getLighterHslColor({ val, minVal, maxVal }) {
    const maxColorHsl = 'hsl(187, 80%, 60%)';
    const maxColor = +maxColorHsl.match(/[ ,](\d{1,3})%\)$/)[1];
    const valColor = maxColor - (maxVal - val) / (maxVal - minVal) * (maxColor - 100);
    const valColorHsl = maxColorHsl.replace(/\d{1,2}%\)/, `${Math.round(valColor)}%)`);
    return valColorHsl;
  },
};

function getNumber(variable) {
  let number;
  switch (typeof variable) {
    case 'number': number = isNaN(variable) ? 0 : variable; break;
    case 'boolean': number = +variable; break;
    default: number = 0;
  }
  return number;
}

function crop(arg) {
  return String(arg).slice(0, maxStringLengthOnChart);
}

function esc(arg) {
  return (String(arg)
    .replace('.', '·')
    .replace(' ', '¯')
  );
}

function reEsc(arg) {
  return (String(arg)
    .replace('·', '.')
    .replace('¯', ' ')
  );
}

function getDateString(values, format, grouping) {
  if (format) return moment(values).format(format);
  if (grouping === 'week') return `${values[1]} week of ${values[0]}`;
  if (grouping === 'doy') return `${values[1]} day of ${values[0]}`;
  if (grouping === 'dow') return getDayNameByNumber(values[0]);
  return null;
}

function getDateFormat(dateType) {
  switch (dateType) {
    case 'year': return 'YYYY';
    case 'month': return 'MMM YYYY';
    case 'day': return 'DD MMM YYYY';
    case 'hour': return 'DD MMM YYYY HH:mm';
    case 'minute': return 'DD MMM YYYY HH:mm';
    default: return null;
  }
}

function getDayNameByNumber(dayNumber) {
  switch (dayNumber) {
    case 0: return 'Sunday';
    case 1: return 'Monday';
    case 2: return 'Tuesday';
    case 3: return 'Wednesday';
    case 4: return 'Thursday';
    case 5: return 'Friday';
    case 6: return 'Saturday';
    default: return null;
  }
}

function addBackgroundColors(datasets, chartType) {
  let i = 0;
  datasets.forEach(dataset => {
    dataset.backgroundColor = getBackgroundColor(chartType, dataset.data, ++i);
  });
}

function getBackgroundColor(chartType, data, i) {
  let j = 0;
  switch (chartType) {
    case 'bar': return color(i, 0.7);
    case 'line':
    case 'radar':
      return color(i, 0.4);
    case 'pie':
    case 'doughnut':
    case 'polarArea':
      return data.map(() => color(++j, 0.7));
    default: return null;
  }
}

// totaling block
function addTotals({ fields, model, dataMap: data, pivotColsHeaders }) {
  const { rows = [], values = [] } = model;
  if (!values.length) return data;
  const rowsNames = rows.map(fieldId => _.find(fields, f => f.id === fieldId).key);
  const valuesExp = values.map(fieldId => _.find(fields, f => f.id === fieldId).expression);
  const aggFunc = valuesExp[0].slice(0, valuesExp[0].indexOf('('));
  const colKeysArr = _.flatten(pivotColsHeaders)
    .map(col => _.values(_.omit(col, ['colGroup1Value', 'colGroup2Value'])).join('ՖՖՖ'));

  let dataTotaled = data;
  switch (colKeysArr.length && rowsNames.length) {
    case 0:
    case 1: dataTotaled = addRowsTotal(data, colKeysArr, aggFunc); break;
    case 2: dataTotaled = data.map(d => addRowsTotal(d, colKeysArr, aggFunc)); break;
    case 3: dataTotaled = data.map(d => d.map(d1 => addRowsTotal(d1, colKeysArr, aggFunc)));
      break;
    default: dataTotaled = data;
  }
  return dataTotaled;
}

function addRowsTotal(rowsArr, colKeysArr, aggFunc) {
  rowsArr.forEach(row => {
    colKeysArr.forEach(COL_KEY => {
      row.ROW_TOTAL = addToTotal(row.ROW_TOTAL, row[COL_KEY], aggFunc);
    });
  });
  return rowsArr;
}

function addToTotal(total, elem, aggFunc) {
  let newTotal;
  if (total) {
    switch (aggFunc) {
      case 'COUNT':
      case 'SUM': newTotal = total + (isNaN(+elem) ? 0 : +elem); break;
      case 'MIN':
        if (isNaN(+elem)) newTotal = total;
        else newTotal = total > +elem ? +elem : total; break;
      case 'MAX':
        if (isNaN(+elem)) newTotal = total;
        else newTotal = total < +elem ? +elem : total; break;
      default:
    }
  }
  if (!total && !isNaN(+elem)) newTotal = +elem;
  return newTotal;
}

// sorting block
function sortData({ totaledData: data, fields, model, sorting }) { // Sorry for this
  const { rows = [], columns = [] } = model;
  const rowsNames = rows.map(fieldId => _.find(fields, f => f.id === fieldId).name);
  const colsNames = columns.map(fieldId => _.find(fields, f => f.id === fieldId).name);

  let sorted = data;
  sorting.forEach(({ col, order }) => {
    if (!(typeof col === 'string' || typeof col === 'number')) {
      const colKey = colsNames.map(colName => col[colName]).join('ՖՖՖ');
      switch (rowsNames.length) {
        case 1: sorted = sortByNumber(sorted, colKey, order); break;
        case 2: sorted = sorted.map(d => sortByNumber(d, colKey, order)); break;
        case 3: sorted = sorted.map(d => d.map(d1 => sortByNumber(d1, colKey, order))); break;
        default:
      }
    } else {
      switch (rowsNames.indexOf(col)) {
        case 0: sorted = sortByString(sorted, col, order, rowsNames.length - 1); break;
        case 1: sorted = sorted.map(d => sortByString(d, col, order, rowsNames.length - 2)); break;
        case 2: sorted = sorted.map(d => d.map(d1 => sortByString(d1, col, order))); break;
        case -1:
          switch (rowsNames.length) {
            case 1: sorted = sortByNumber(sorted, col, order); break;
            case 2: sorted = sorted.map(d => sortByNumber(d, col, order)); break;
            case 3: sorted = sorted.map(d => d.map(d1 => sortByNumber(d1, col, order))); break;
            default:
          } break;
        default:
      }
    }
  });
  return sorted;
}

function sortByNumber(arr, prop, order) {
  return order === 'desc' ?
    mergeSort((a, b) => (a[prop] || 0) - (b[prop] || 0), arr) :
    mergeSort((a, b) => (b[prop] || 0) - (a[prop] || 0), arr);
}

function sortByString(arr, prop, order, levels = 0) {
  let result;
  switch (levels) {
    case 0: result = order === 'asc' ?
      mergeSort((a, b) => (a[prop] > b[prop] ? -1 : 1), arr) :
      mergeSort((a, b) => (a[prop] < b[prop] ? -1 : 1), arr);
      break;
    case 1: result = order === 'asc' ?
      mergeSort((a, b) => (a[0][prop] > b[0][prop] ? -1 : 1), arr) :
      mergeSort((a, b) => (a[0][prop] < b[0][prop] ? -1 : 1), arr);
      break;
    case 2: result = order === 'asc' ?
      mergeSort((a, b) => (a[0][0][prop] > b[0][0][prop] ? -1 : 1), arr) :
      mergeSort((a, b) => (a[0][0][prop] < b[0][0][prop] ? -1 : 1), arr);
      break;
    default: result = arr;
  }
  return result;
}

function mergeSort(comparatorFn, arr) {
  const len = arr.length;
  if (len >= 2) {
    const firstHalf = arr.slice(0, len / 2);
    const secondHalf = arr.slice(len / 2, len);
    return merge(comparatorFn,
      mergeSort(comparatorFn, firstHalf), mergeSort(comparatorFn, secondHalf));
  }
  return arr.slice();
}

function merge(comparatorFn, arr1, arr2) {
  const result = [];
  let left1 = arr1.length;
  let left2 = arr2.length;
  while (left1 > 0 && left2 > 0) {
    if (comparatorFn(arr1[0], arr2[0]) <= 0) {
      result.push(arr1.shift());
      left1--;
    } else {
      result.push(arr2.shift());
      left2--;
    }
  }
  if (left1 > 0) {
    result.push.apply(result, arr1);
  } else {
    result.push.apply(result, arr2);
  }
  return result;
}
