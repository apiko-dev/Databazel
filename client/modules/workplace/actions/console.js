import moment from 'moment';
import { dateParts } from '/lib/constants';
import { _ } from 'meteor/underscore';

export default {
  getStringSQLQuery({ LocalState, Notificator }, queryObject) {
    if (!queryObject) return null;
    const currentDatabase = LocalState.get('CURRENT_DATABASE');
    if (!currentDatabase) return null;
    const dbName = currentDatabase.name;
    const selectSnippet = getSelectSnippet(queryObject.fields);
    const fromSnippet = getFromSnippet(queryObject.from, dbName);

    if (!selectSnippet || !fromSnippet) return null;
    const joinSnippet = getJoinSnippet(queryObject.join, queryObject.on, dbName);
    const additionSnippet = getAdditionSnippet(queryObject);
    const paginationSnippet = getPaginationSnippet(queryObject.pagination);
    const strSQLQuery = `${selectSnippet}${fromSnippet}${joinSnippet}` +
      `${additionSnippet}${paginationSnippet}`;

    if (queryObject.join && !joinSnippet && !!~selectSnippet.indexOf(queryObject.join)) {
      return Notificator.important('Please, join collections to continue', 'Warning');
    }
    return changeFieldsType(strSQLQuery, queryObject.collectionFields);
  },
};

function getSelectSnippet(fields) {
  if (!fields || !fields.length) return null;
  const processedFields = fields.map(field => processField(field));
  return `SELECT\n\t${processedFields.join(',\n\t')}`;
}

function getFromSnippet(from, dbName) {
  if (!from) return null;
  const collectionName = from.replace(/\s|-/gi, '_');
  return `\nFROM\n\t\`${dbName}/${from}\` AS ${collectionName}`;
}

function getJoinSnippet(join, on, dbName) {
  if (join && on && on.leftField && on.rightField) {
    return `\nJOIN \`${dbName}/${join}\` AS ${join}` +
      `\nON ${on.leftField.expression} = ${on.rightField.expression}`;
  }
  return '';
}

function getAdditionSnippet({ fields, collectionFields }) {
  const whereSnippet = getWhereSnippet(collectionFields);
  const groupSnippet = getGroupSnippet(fields);
  const havingSnippet = getHavingSnippet(fields);
  const sortSnippet = getSortSnippet(fields);
  const combinedSnippet = combineFilters(whereSnippet, groupSnippet, havingSnippet);
  return `${combinedSnippet}${sortSnippet}`;
}

function getWhereSnippet(collectionFields) {
  if (!collectionFields) return null;
  const filterSnippet = _.map(collectionFields, (field) => {
    if (!field.filters) return null;
    return getFilterSnippet(field.filters, field.expression, field.type);
  });
  return _.compact(filterSnippet).join(' AND\n\t');
}

function getGroupSnippet(fields) {
  const groupSnippet = _.chain(fields).map((field) => {
    if (field.grouping) return field.processedExpression;
    return null;
  }).compact()
    .value();
  return groupSnippet.length ? `\nGROUP BY\n\t${groupSnippet.join(',\n\t')}` : '';
}

function getHavingSnippet(fields) {
  const havingSnippet = _.chain(fields)
    .map((field) => {
      const { filters } = field;
      if (!filters) return null;
      return `(${getFilterSnippet(
        filters, field.processedExpression, field.currentType, field.grouping
      )})`;
    })
    .compact()
    .value();
  return havingSnippet.join(' AND\n\t');
}

function getSortSnippet(fields) {
  const sortSnippet = _.chain(fields).map((field) => {
    if (field.grouping && field.currentType === 'date') {
      const selectedDatePart = dateParts.slice(dateParts.indexOf(field.grouping));
      let processedDatePart;

      if (field.grouping === 'dow') {
        processedDatePart = ['_dow'];
        return null;
      } else {
        processedDatePart = selectedDatePart.reverse().map((DatePart) => `_${DatePart}`);
        if (_.last(processedDatePart) !== `_${field.grouping}`) {
          processedDatePart.push(`_${field.grouping}`);
        }
      }
      return processedDatePart.join(',\n\t');
    }

    if (field.sort) return `${field.name} ${field.sort.toUpperCase()}`;
    return null;
  }).compact()
    .value();
  return sortSnippet.length ? `\nORDER BY\n\t${sortSnippet.join(',\n\t')}` : '';
}

function getPaginationSnippet({ limit, page }) {
  let pagination = '';
  const offset = limit * (page - 1);
  if (offset) pagination += `\nOFFSET ${offset}`;
  if (limit) pagination += `\nLIMIT ${limit}`;
  return pagination;
}

function processField(field) {
  const { expression, currentType } = field;
  let { expression: newExpression } = field;

  if (currentType === 'date') {
    newExpression = getDateExpression(newExpression, field.grouping);
  }
  if (field.type !== currentType) {
    newExpression = changeExpressionByType(newExpression, currentType, field.type);
  }
  newExpression = processIfFunc(newExpression, expression);
  newExpression = parseDateNow(newExpression);

  const regexp = / AS _.+?\b/g;
  field.processedExpression = newExpression.replace(regexp, '');

  if (currentType === 'date' && regexp.test(newExpression)) return newExpression;
  const parsedName = !!~field.name.search(/\s|-/) ? `\`${field.name}\`` : field.name;
  return `${newExpression} AS ${parsedName}`;
}

function combineFilters(whereSnippet, groupSnippet, havingSnippet) {
  let having = '';
  let where = '';
  const isAggregation = !!~havingSnippet.search(/SUM|COUNT|MIN|MAX|AVG/i);

  if (groupSnippet && havingSnippet) {
    having = `\nHAVING\n\t${havingSnippet} `;
  }
  if (whereSnippet) {
    where = `\nWHERE\n\t${whereSnippet} `;
    if (!groupSnippet && havingSnippet) {
      where += `AND\n\t${havingSnippet} `;
    }
  } else if (!groupSnippet && !isAggregation && havingSnippet) {
    where = `\nWHERE\n\t${havingSnippet} `;
  }
  return `${where}${groupSnippet}${having}`;
}

function changeExpressionByType(expression, currentType, type) {
  const convertFunc = getConvertFunc(currentType, type);
  return `${convertFunc}(${expression})`;
}

function getConvertFunc(currentType, type) {
  switch (currentType) {
    case 'number': return 'integer';
    case 'string': return 'to_string';
    case 'boolean': return 'boolean';
    case 'date': return type === 'number' ? 'TO_TIMESTAMP' : 'timestamp';
    default: return null;
  }
}

function getDateExpression(expression, groupBy) {
  if (!groupBy) return expression;
  let selectedDateParts;

  if (groupBy === 'dow') {
    selectedDateParts = ['dow'];
  } else {
    selectedDateParts = dateParts.slice(dateParts.indexOf(groupBy)).reverse();
  }

  if (_.last(selectedDateParts) !== groupBy) selectedDateParts.push(groupBy);
  const newExpression = selectedDateParts.map((datePart, i) => {
    const linefeed = i ? '\n\t' : '';
    return `${linefeed}DATE_PART("${datePart}", ${expression}) AS _${datePart}`;
  });
  return newExpression.join(', ');
}

function getFilterSnippet(filters, expression, type, group) {
  let filterQuery = '';
  if (type === 'date') return getDateFilter(filters, expression, group);
  if (type === 'boolean') return `${expression} = ${filters}`;
  if (!filters || _.isObject(filters) && !filters.length) return null;

  const length = filters.length - 1;
  filters.forEach((filter, i) => {
    const joinOperator = i < length ? filter.joinOperator : '';
    const value = type === 'string' && filter.operator !== '<> null' ?
      `"${filter.value || ''}"` : filter.value || '';
    const linefeed = joinOperator ? '\n\t' : '';
    filterQuery += `${expression} ${filter.operator} ${value} ${joinOperator}${linefeed}`;
  });
  return filterQuery;
}

function getDateFilter(filter, expression, group) {
  if (_.isEmpty(filter)) return '';
  let fromDateExp;
  let toDateExp;
  if (filter.fromDate) {
    const fromDate = getStrDate(filter.fromDate, filter.fromTime, group);
    fromDateExp = ` ${expression} >= ${fromDate}`;
  }
  if (filter.toDate) {
    const toDate = getStrDate(filter.toDate, filter.toTime, group);
    toDateExp = ` ${expression} <= ${toDate}`;
  }
  if (!toDateExp) return fromDateExp;
  if (!fromDateExp) return toDateExp;
  return `${fromDateExp} AND\n\t${toDateExp}`;
}

function getStrDate(date, time, group) {
  if (group) {
    const funcName = getDatePartFunc(group) || group;
    const result = moment(date)[funcName]();
    return group === 'month' ? result + 1 : result;
  }
  if (date && !time) return `DATE("${moment(date).format('YYYY-MM-DD')}")`;
  if (date && time) {
    return `TIMESTAMP("${moment(date).format('YYYY-MM-DD')}T${moment(time).format('HH:mm')}:00Z")`;
  }
  return null;
}

function getDatePartFunc(datePartName) {
  switch (datePartName) {
    case 'day': return 'date';
    case 'doy': return 'dayOfYear';
    case 'dow': return 'day';
    default: return null;
  }
}

function processIfFunc(newExpression, expression) {
  return newExpression.replace(/if\((.*?);\)|if\((.*?)\)/ig, (func, args, args2) => {
    const argsArr = args ? args.split(';') : args2.split(';');
    const falseValue = argsArr[2] ? argsArr[2] : 'NULL';
    return `CASE (${argsArr[0]}) WHEN TRUE THEN ${argsArr[1] || expression} ` +
      `ELSE ${falseValue} END`;
  });
}

function changeFieldsType(query, collectionFields = {}) {
  let processedQuery;
  _.map(collectionFields, (field, key) => {
    if (field.currentType !== field.type) {
      const regexp = new RegExp(key, 'g');
      const convertFunc = getConvertFunc(field.currentType, field.type);
      const newStr = convertFunc ? `${convertFunc}(${key})` : key;
      processedQuery = query.replace(regexp, newStr);
    }
  });
  return processedQuery || query;
}

function parseDateNow(expression) {
  return expression.replace(/Date\.now\(\)/gi, () => `TO_TIMESTAMP(${Date.now()})`);
}
