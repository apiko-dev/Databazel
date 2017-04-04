import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { Dashboards } from '/lib/collections';

export default () => {
  Meteor.publish('dashboards', function (dashboardId) {
    check(dashboardId, Match.Maybe(String));
    if (this.userId) {
      const filter = Meteor.users.findOne(this.userId).isAdmin ? {} : { users: this.userId };
      if (dashboardId) filter._id = dashboardId;
      return Dashboards.find(filter);
    }
  });
};
