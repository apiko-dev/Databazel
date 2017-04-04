import { _ } from 'meteor/underscore';

export default {
  deleteUser({ Meteor, LocalState }, userId) {
    Meteor.call('users.deleteUser', userId, (err) => {
      if (err && err.reason) LocalState.set('DELETING_USER_ERROR', err.reason);
    });
  },
  shareDashboards({ Meteor }, { userId, selectedDashboards, currentDashboards }) {
    const removedFrom = _.difference(selectedDashboards, currentDashboards)[0];
    const addedTo = _.difference(currentDashboards, selectedDashboards)[0];
    Meteor.call('dashboard.handleSharingToUser',
      { entityId: addedTo || removedFrom, userId, isSharing: !!addedTo });
  },
  shareCharts({ Meteor }, { userId, selectedCharts, currentCharts }) {
    const removedFrom = _.difference(selectedCharts, currentCharts)[0];
    const addedTo = _.difference(currentCharts, selectedCharts)[0];
    Meteor.call('chart.handleSharingToUser',
      { entityId: addedTo || removedFrom, userId, isSharing: !!addedTo, fromDashboard: false });
  },
};
