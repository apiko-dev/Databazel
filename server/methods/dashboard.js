import { Meteor } from 'meteor/meteor';
import { Dashboards, ChartsLocations } from '/lib/collections';
import { check, Match } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { Email } from 'meteor/email';
import commonFunctions from '/lib/common_functions';
import getItemShareLetterOptions from '../lib/email/getItemShareLetterOptions';

export default () => {
  Meteor.methods({
    'dashboard.create'({ name }) {
      check(name, String);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');

      return Dashboards.insert({
        name,
        chartsId: [],
        users: [this.userId],
        viewsCounter: 0,
      });
    },

    'dashboard.copy'({ dashboardId }) {
      check(dashboardId, String);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');

      const dashboard = Dashboards.findOne({ _id: dashboardId });
      const existingNames = Dashboards.find({ users: this.userId }).map(d => d.name);
      dashboard.name = commonFunctions.findFreeName(existingNames, `${dashboard.name} copy`);
      return Dashboards.insert(_.omit(dashboard, '_id'));
    },

    'dashboard.remove'({ dashboardId }) {
      check(dashboardId, String);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');
      if (Meteor.user().isAdmin) {
        Dashboards.remove({ _id: dashboardId });
      } else {
        Dashboards.update(
          { _id: dashboardId, users: this.userId },
          { $pull: { users: this.userId } },
          (err, res) => {
            if (err) throw new Meteor.Error(err);

            if (res === 1) {
              Dashboards.remove({ _id: dashboardId, users: { $size: 0 } });
            }
          }
        );
      }
    },

    'dashboard.saveChartsLocation'({ dashboardId, newLocations }) {
      check(dashboardId, String);
      check(newLocations, Object);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');

      _.each(newLocations, (location, chartId) => {
        ChartsLocations.update({
          chartId,
          dashboardId,
          userId: this.userId,
        }, {
          $set: { breakpoints: location },
        }, {
          upsert: true,
        });
      });
    },

    'dashboard.removeChartFromDashboard'({ chartId, dashboardId }) {
      check(chartId, String);
      check(dashboardId, Match.OneOf(String, Array));
      if (!this.userId) throw new Meteor.Error('401', 'User not found');

      const query = { _id: typeof dashboardId === 'string' ? dashboardId : { $in: dashboardId }};
      if (!Meteor.user().isAdmin) query.users = this.userId;
      Dashboards.update(query, { $pull: { chartsId: chartId } });
    },

    'dashboard.removeChartFromAllDashboards'({ chartId }) {
      check(chartId, String);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');
      const query = { chartsId: chartId };
      if (!Meteor.user().isAdmin) query.users = this.userId;
      Dashboards.update(
        query,
        { $pull: { chartsId: chartId } },
        { multi: true }
      );
    },

    'dashboard.rename'({ dashboardId, newName }) {
      check([dashboardId, newName], [String]);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');
      const query = { _id: dashboardId };
      if (!Meteor.user().isAdmin) query.users = this.userId;
      Dashboards.update(query, { $set: { name: newName } });
    },

    'dashboard.addChartToDashboard'({ chartId, dashboardId }) {
      check(chartId, String);
      check(dashboardId, Match.OneOf(String, Array));
      if (!this.userId) throw new Meteor.Error('401', 'User not found');

      const query = { _id: typeof dashboardId === 'string' ? dashboardId : { $in: dashboardId }};
      if (!Meteor.user().isAdmin) query.users = this.userId;

      return Dashboards.update(query, { $push: { chartsId: chartId } }, { multi: true });
    },

    'dashboard.handleSharingToUser'({ entityId, userId, isSharing }) {
      check([userId, entityId], [Match.Maybe(String)]);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');
      const query = { _id: entityId };
      const modifier = {};
      if (!Meteor.user().isAdmin) query.users = this.userId;
      modifier[isSharing ? '$push' : '$pull'] = { users: userId };
      Dashboards.update(query, modifier);
      // send email to user
      // TODO uapasha add account verification check and notification
      if (isSharing) {
        const dashboard = Dashboards.findOne({ _id: entityId });
        const chartsNames = dashboard.getChartsNames();
        const itemName = dashboard.name;
        const email = Meteor.users.findOne(userId).getEmail();
        this.unblock();
        const options = getItemShareLetterOptions({
          itemId: entityId,
          itemType: 'dashboard',
          itemName,
          chartsNames,
        });
        options.to = email;
        Email.send(options);
      }
    },

    'dashboard.incViewsCounter'({ dashboardId }) {
      if (this.userId) {
        check(dashboardId, String);
        const query = { _id: dashboardId };
        if (!Meteor.user().isAdmin) query.users = this.userId;
        Dashboards.update(query, { $inc: { viewsCounter: 1 } });
      }
    },
  });
};
