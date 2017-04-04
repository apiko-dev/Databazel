import { Dashboards, Charts } from './../collections';
import { Meteor } from 'meteor/meteor';

Meteor.users.helpers({
  isShared({ entityType, entityId }) {
    if (entityType === 'chart') {
      return !!Charts.findOne({ _id: entityId, users: this._id });
    } else {
      return !!Dashboards.findOne({ _id: entityId, users: this._id });
    }
  },
  getEmail() {
    return this.emails[0].address;
  },
  isVerified() {
    return this.emails[0].verified;
  },
  isMe() {
    return this._id === Meteor.userId();
  },
});
