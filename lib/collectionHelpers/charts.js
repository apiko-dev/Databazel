import { Dashboards, Charts } from './../collections';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

Charts.helpers({
  inclusiveDashboardsIds() {
    return Dashboards.find({ users: Meteor.userId() }, { fields: { chartsId: 1 } }).fetch()
      .filter(board => !!~board.chartsId.indexOf(this._id))
      .map(board => board._id);
  },

  getUsersExceptCurrent() {
    return _.without(this.users, Meteor.userId());
  },
});
