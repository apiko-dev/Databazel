import { Meteor } from 'meteor/meteor';
import { Charts } from '/lib/collections';
import { check, Match } from 'meteor/check';
import { Email } from 'meteor/email';
import { _ } from 'meteor/underscore';
import getItemShareLetterOptions from '../lib/email/getItemShareLetterOptions';
import commonFunctions from '/lib/common_functions';
import dataProcessing from '/lib/data_processing.js';

export default () => {
  Meteor.methods({
    'charts.saveChart'(chart) {
      check(chart, Object);
      chart.modified = Date.now();
      if (!this.userId) throw new Meteor.Error('401', 'User not found');
      if (!Meteor.user().isAdmin) {
        if (!chart.users) chart.users = [this.userId];
        if (!~chart.users.indexOf(this.userId)) chart.users.push(this.userId);
      }
      chart.viewObject.dataTimeStamp = Date.now();
      return Charts.update({ _id: chart._id }, chart);
    },

    'charts.saveAsChart'(chart) {
      check(chart, Object);
      chart.modified = Date.now();
      if (!this.userId) throw new Meteor.Error('401', 'User not found');
      if (!Meteor.user().isAdmin) {
        if (!chart.users) chart.users = [this.userId];
        if (!~chart.users.indexOf(this.userId)) chart.users.push(this.userId);
      }
      chart.viewObject.dataTimeStamp = Date.now();
      delete chart._id;
      return Charts.insert(chart);
    },

    'chart.copy'({ chartId }) {
      check(chartId, String);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');
      const chartQuery = { _id: chartId };
      const namesQuery = {};
      if (!Meteor.user().isAdmin) {
        chartQuery.users = this.userId;
        namesQuery.users = this.userId;
      }
      const chart = _.omit(Charts.findOne(chartQuery), ['_id', 'users']);
      const existingNames = Charts.find(namesQuery).map(c => c.chartName);
      chart.chartName = commonFunctions.findFreeName(existingNames, `${chart.chartName} copy`);
      return Charts.insert(chart);
    },

    'chart.remove'({ chartId }) {
      check(chartId, String);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');
      const query = { _id: chartId };
      if (!Meteor.user().isAdmin) query.users = this.userId;
      Charts.remove(query);
    },

    'chart.handleChartAutorefresh'({ chartId, autorefresh }) {
      check(chartId, String);
      check(autorefresh, Boolean);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');
      const query = { _id: chartId };
      if (!Meteor.user().isAdmin) query.users = this.userId;
      Charts.update(query, { $set: { autorefresh } });
    },

    'chart.renameChart'({ chartId, newName }) {
      check([chartId, newName], [String]);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');
      const query = { _id: chartId };
      if (!Meteor.user().isAdmin) query.users = this.userId;
      Charts.update(query, { $set: { chartName: newName } });
    },

    'chart.handleSharingToUser'({ entityId, userId, isSharing, fromDashboard }) {
      check([userId, entityId], [Match.Maybe(String)]);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');
      const query = { _id: entityId };
      const isAdmin = Meteor.user().isAdmin;
      if (isSharing) {
        query.users = { $nin: [userId] };
        if (!isAdmin) query.users.$all = [this.userId];
        Charts.update(query, { $push: { users: userId } });
        // send email to user
        // TODO add account verification check and notification
        if (!fromDashboard && userId !== this.userId) {
          const to = Meteor.users.findOne(userId).getEmail();
          const itemName = Charts.findOne(
            { _id: entityId },
            { fields: { chartName: 1 } }
          ).chartName;
          this.unblock();
          const options = getItemShareLetterOptions({
            itemId: entityId,
            itemType: 'chart',
            itemName,
          });
          options.to = to;
          Email.send(options);
        }
      } else {
        query['users.1'] = { $exists: true };
        if (!isAdmin) query.users = this.userId;
        Charts.update(query, { $pull: { users: userId } });
      }
    },

    'chart.refreshData'(chartId) {
      check(chartId, String);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');
      this.unblock();
      const { database, viewObject, queryObject: { fields } } = Charts.findOne(chartId);
      const { data } = Meteor.call('quasar.getData', database, viewObject.query);
      viewObject.data = dataProcessing.process(data, fields);
      viewObject.dataTimeStamp = Date.now();
      const query = { _id: chartId };
      if (!Meteor.user().isAdmin) query.users = this.userId;
      Charts.update(query, { $set: { viewObject } });
    },

    'charts.deleteByMountName'(mountName) {
      check(mountName, String);
      const user = Meteor.user();
      if (!user || !user.isAdmin) throw new Meteor.Error('550', 'Permission denied');

      Charts.remove({ 'database.mount': mountName });
    },

    'charts.updateChartMount'(database, { mountName, mongoUrl }) {
      check(database, Object);
      check(mountName, String);
      check(mongoUrl, String);
      const user = Meteor.user();
      if (!user || !user.isAdmin) throw new Meteor.Error('550', 'Permission denied');

      const dbName = mongoUrl.slice(mongoUrl.lastIndexOf('/') + 1);
      Charts.update(
        { 'database.mount': database.mountName },
        { $set: { database: { mount: mountName, name: dbName } } }
      );
    },

    'charts.setIsPublished'({ chartId, isPublished }) {
      check(chartId, String);
      check(isPublished, Boolean);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');
      const query = { _id: chartId };
      if (!Meteor.user().isAdmin) query.users = this.userId;
      Charts.update(query, { $set: { isPublished } });
    },
  });
};
