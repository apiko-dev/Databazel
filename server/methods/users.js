import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export default () => {
  Meteor.methods({
    'users.deleteUser'(userId) {
      check(userId, String);
      const user = Meteor.user();
      if (!user || !user.isAdmin) throw new Meteor.Error('403', 'Permission denied');
      Meteor.users.remove(userId);
    },
    'users.setPermissions'({ userId, isAdmin }) {
      check(userId, String);
      check(isAdmin, Boolean);
      const user = Meteor.user();
      if (!user || !user.isAdmin) throw new Meteor.Error('403', 'Permission denied');
      Meteor.users.update(userId, { $set: { isAdmin } });
    },
  });
};
