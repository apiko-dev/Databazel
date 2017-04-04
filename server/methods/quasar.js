import { Meteor } from 'meteor/meteor';
import { Async } from 'meteor/meteorhacks:async';
import { check, Match } from 'meteor/check';
import Quasar from '../lib/quasar';

export default () => {
  Meteor.methods({
    'quasar.getMetadata'(path) {
      check(path, String);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');

      const metadataResponse = Async.runSync((done) => {
        Quasar.getMetadata(path, (err, res) => {
          const result = res ? res.data.children : res;
          done(err, result);
        });
      });

      if (metadataResponse.error) {
        throw new Meteor.Error(metadataResponse.error.code, metadataResponse.error.message);
      }
      return metadataResponse.result;
    },

    'quasar.getData'(database, query, requestId) {
      check(database, Object);
      check(query, String);
      check(requestId, Match.Maybe(String));
      if (!this.userId) throw new Meteor.Error('401', 'User not found');

      if (requestId) this.unblock();
      const getDataResponse = Async.runSync((done) => {
        Quasar.getData(database, query, (err, res) => {
          done(err, res);
        });
      });

      if (getDataResponse.error) {
        throw new Meteor.Error(getDataResponse.error.code, getDataResponse.error.message);
      }
      return ({ data: getDataResponse.result.data, answerId: requestId });
    },

    'quasar.getMongoQuery'(database, query) {
      check(database, Object);
      check(query, String);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');
      const response = Async.runSync(done => {
        Quasar.getMongoQuery(database, query, (err, res) => {
          done(err, res);
        });
      });
      if (response.error) {
        throw new Meteor.Error(response.error.code, response.error.message);
      }
      return response.result.data;
    },

    'quasar.createMount'(mountName, uri) {
      check(mountName, String);
      check(uri, String);
      const user = Meteor.user();
      if (!user || !user.isAdmin) throw new Meteor.Error('550', 'Permission denied');

      const response = Async.runSync((done) => {
        Quasar.createMount(mountName, uri, (err, res) => {
          done(err, res);
        });
      });

      if (response.error) {
        throw new Meteor.Error(response.error.code, response.error.message);
      }
      return response.result.content;
    },

    'quasar.deleteMount'(mountName, isSafeDelete) {
      check(mountName, String);
      const user = Meteor.user();
      if (!user || !user.isAdmin) throw new Meteor.Error('550', 'Permission denied');

      const response = Async.runSync((done) => {
        Quasar.deleteMount(mountName, (err, res) => {
          done(err, res);
        });
      });

      if (response.error) {
        throw new Meteor.Error(response.error.code, response.error.message);
      }

      if (!isSafeDelete) Meteor.call('charts.deleteByMountName', mountName);
      return response.result;
    },

    'quasar.updateMount'(database, newDatabase) {
      check(database, Object);
      check(newDatabase, Object);

      Meteor.call('quasar.deleteMount', database.mountName, true);
      Meteor.call('quasar.createMount', newDatabase.mountName, newDatabase.mongoUrl);
    },

    'quasar.getMount'(mountName) {
      check(mountName, String);
      const user = Meteor.user();
      if (!user) throw new Meteor.Error('550', 'Permission denied');
      const response = Async.runSync((done) => {
        Quasar.getMount(`/${mountName}/`, (err, res) => {
          done(err, res.data.mongodb);
        });
      });

      if (response.error) {
        throw new Meteor.Error(response.error.code, response.error.message);
      }
      return response.result;
    },
  });
};
