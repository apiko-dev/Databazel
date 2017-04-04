import { Dashboards, Charts } from './../collections';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

Dashboards.helpers({
  getSharedChartsId() {
    return Charts
      .find({ _id: { $in: this.chartsId }, users: Meteor.userId() })
      .map(chart => chart._id);
  },
  getChartsNames() {
    return Charts
      .find({ _id: { $in: this.chartsId } }, { fields: { chartName: 1 } })
      .map(el => el.chartName);
  },
  getUsersExceptCurrent() {
    return _.without(this.users, Meteor.userId());
  },
});
