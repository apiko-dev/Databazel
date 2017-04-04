import { Meteor } from 'meteor/meteor';
import { Dashboards } from '/lib/collections';
import { _ } from 'meteor/underscore';

export default () => {
  Dashboards.after.remove((userId, doc) => {
    Meteor.call('chartsLocations.remove', { dashboardId: doc._id });
  });
  Dashboards.before.update((userId, doc, fieldNames, modifier) => {
    if (
      fieldNames.length === 1 &&
      _.keys(modifier).length === 1 &&
      _.keys(modifier)[0] === '$push' &&
      fieldNames[0] === 'users' &&
      !!~doc.users.indexOf(modifier.$push.chartsId)
    ) return false;
  });
  Dashboards.after.update((userId, doc, fieldNames, modifier) => {
    if (fieldNames.length === 1 && _.keys(modifier).length === 1) {
      switch (`${_.keys(modifier)[0]}_${fieldNames[0]}`) {
        case '$pull_chartsId':
          Meteor.call('chartsLocations.remove',
            { dashboardId: doc._id, chartId: modifier.$pull.chartsId,
          });
          break;
        case '$push_chartsId':
          doc.users.forEach(user => {
            Meteor.call('chart.handleSharingToUser', {
              entityId: modifier.$push.chartsId, userId: user,
              isSharing: true,
            });
          });
          break;
        case '$push_users':
          doc.chartsId.forEach(chartId => {
            Meteor.call('chart.handleSharingToUser', {
              entityId: chartId,
              userId: modifier.$push.users,
              isSharing: true,
              fromDashboard: true,
            });
          });
          break;
        case '$pull_users':
          Meteor.call('chartsLocations.remove', {
            dashboardId: doc._id,
            userId: modifier.$pull.users,
          });
          doc.chartsId.forEach(chartId => {
            if (
              Dashboards.find({
                _id: { $ne: doc._id },
                users: { $all: [modifier.$pull.users] },
                chartsId: { $all: [chartId] },
              }).count() === 0
            ) {
              Meteor.call('chart.handleSharingToUser', {
                entityId: chartId,
                userId: modifier.$pull.users,
                isSharing: false,
              });
            }
          });
          break;
        default:
      }
    }
  });
};
