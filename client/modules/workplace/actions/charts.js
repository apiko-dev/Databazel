import i18n from 'meteor/universe:i18n';
import downloads from '/lib/downloads';
import { _ } from 'meteor/underscore';

export default {
  handleDashboardsContainingChart({ Meteor }, { chartId, dashboards, currentDashboards }) {
    const previousDashboards = dashboards.filter(board => board.added).map(board => board._id);
    const removedFrom = _.difference(previousDashboards, currentDashboards)[0];
    const addedTo = _.difference(currentDashboards, previousDashboards)[0];
    const methodName = addedTo ?
      'dashboard.addChartToDashboard' :
      'dashboard.removeChartFromDashboard';
    Meteor.call(methodName, { dashboardId: addedTo || removedFrom, chartId });
  },

  getSelectDashboardsOptions(context, dashboards) {
    const options = {};
    if (dashboards.length) {
      options.options = dashboards.map(board => ({
        value: board._id,
        text: board.name,
      }));
    } else {
      options.options = [{
        value: 'no_dashboard_yet',
        text: i18n.__('no_dashboard_yet'),
      }];
    }
    return options.options;
  },

  handleUsersAddedToChart({ Notificator }, { chartId, users, currentUsers }) {
    const previousUsers = users.filter(user => (
      user.isShared({ entityType: 'chart', entityId: chartId })
    )).map(user => user._id);
    const unsharedFrom = _.difference(previousUsers, currentUsers)[0];
    const sharedTo = _.difference(currentUsers, previousUsers)[0];
    const isSharing = !!sharedTo;
    const message = isSharing ? 'Chart shared successfully' : 'User removed from the chart';
    Notificator.snackbar(message, 'positive');
    return { isSharing, userId: sharedTo || unsharedFrom };
  },

  getDashboardsForUserChart({ Collections }, { userId, chartId }) {
    return Collections.Dashboards.find({ users: userId, chartsId: chartId }).fetch();
  },

  saveChart({ Meteor, FlowRouter, Notificator, LocalState }, chart, needRedirect, callback) {
    const dashboardId = FlowRouter.getParam('dashboardId');
    parseCollectionFieldNames(chart.queryObject.collectionFields);
    const method = needRedirect ? 'charts.saveAsChart' : 'charts.saveChart';
    chart.database = LocalState.get('CURRENT_DATABASE');
    Meteor.call(method, chart, (err, res) => {
      if (err) {
        console.error(err);
        Notificator.snackbar('chart_is_not_saved', 'negative');
        return;
      }
      Notificator.snackbar(`Chart saved${needRedirect ? ` as ${chart.chartName}` : ''}`,
        'positive');
      if (!needRedirect) return;
      callback(res);
      if (dashboardId) {
        FlowRouter.go('dashboard', { dashboardId });
      } else {
        FlowRouter.go('chartEditor', { chartId: res });
      }
    });
  },

  exportDataToCsv({ Meteor }, component) {
    const chart = component.props.chart;
    Meteor.call('quasar.getMongoQuery', chart.database, chart.viewObject.query, (err, res) => {
      const query = parseQuery(res);
      if (query === 'complex') {
        createCsv(Meteor, chart, result => {
          downloadCsv(Meteor, component, `/${chart.chartName}.csv`, result);
        });
      } else {
        Meteor.call('exportCsv.mongoexport', chart, query, (err2, res2) => {
          if (err2) throw new Meteor.Error(err);
          downloadCsv(Meteor, component, res2);
        });
      }
    });
  },
  exportChartBase64({ LocalState }, chart) {
    const { chartId, image, chartName, chartType } = chart;
    const chartsToExport = LocalState.get('IMAGE_CHART_IMAGES');
    _.extend(chartsToExport[chartId], { image, chartName, chartType });
    const emptyCharts = _.values(chartsToExport).filter(c => !c.chartName);
    if (!emptyCharts.length) {
      downloads.downloadImages(chartsToExport);
      LocalState.set('IMAGE_CHART_IMAGES', null);
    } else {
      LocalState.set('IMAGE_CHART_IMAGES', chartsToExport);
    }
  },
  setChartsIdToExport({ LocalState }, { chartsIdToExport, exportName }) {
    const chartsToExport = {};
    _.each(chartsIdToExport, chartId => {
      chartsToExport[chartId] = { exportName, chartId };
    });
    LocalState.set('IMAGE_CHART_IMAGES', chartsToExport);
  },
  setIsPublished({ Meteor, Notificator }, chartId, isPublished) {
    Meteor.call('charts.setIsPublished', { chartId, isPublished }, err => {
      const errMessage = i18n.__(`error_${isPublished ? '' : 'un'}publish`);
      const resMessage = i18n.__(`chart_is_${isPublished ? 'public' : 'privat'}_now`);
      if (err) Notificator.snackbar(errMessage, 'negative');
      else Notificator.snackbar(resMessage, 'positive');
    });
  },
};

function createCsv(Meteor, chart, callback) {
  const { queryObject: { fields }, viewObject: { query } } = chart;
  const fieldsNames = fields.map(field => field.name);
  const limit = 10000;
  const parsedQuery = query.replace(/( OFFSET \d+)? LIMIT \d+/, ` LIMIT ${limit}`);
  let csv = `${fieldsNames.join(';')};`;
  Meteor.call('quasar.getData', chart.database, parsedQuery, (err, res) => {
    if (err) throw new Meteor.Error(err);
    res.data.forEach(row => {
      csv += '\n';
      fieldsNames.forEach(field => {
        csv += `${row[field]};`;
      });
    });
    callback(csv);
  });
}

function downloadCsv(Meteor, component, outFilePath, csv) {
  Meteor.call('exportCsv.downloadFile', outFilePath, csv, (err, res) => {
    if (err) throw new Meteor.Error(err);
    downloads.createDownload([res.content], 'zip', res.fileName);
    component.setState({ exportInProgress: false });
  });
}

function parseQuery(mongoQuery) {
  let query = mongoQuery.physicalPlan
  .replace(/(\.skip\(\d*\))?(\.limit\(\s*\d*\))/, '');
  if (query.match(/\.[a-z]+\(/g).length > 1 || !~query.indexOf('.find(')) {
    return 'complex';
  }
  query = query.slice(query.indexOf('{'), query.lastIndexOf('}') + 1);
  const arrStr = query.split('');
  let i = 1;
  let openBraceCount = 1;
  let closeBraceCount = 0;
  while (openBraceCount !== closeBraceCount) {
    if (arrStr[i] === '{') openBraceCount++;
    if (arrStr[i] === '}') closeBraceCount++;
    i++;
  }
  if (!~query.indexOf('{', i)) {
    return '';
  }
  query = query.slice(0, i);
  const pattern = /NumberInt\("\d+"\)/g;
  const matches = query.match(pattern);
  if (matches) {
    matches.forEach(match => { query = query.replace(match, match.replace(/"/g, '')); });
  }
  return `'${query}'`;
}

function parseCollectionFieldNames(collectionFields) {
  _.each(collectionFields, (field, name) => {
    collectionFields[name.replace(/\./g, '[dot]')] = field;
    delete collectionFields[name];
  });
}
