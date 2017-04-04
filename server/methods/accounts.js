import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';

export default () => {
  Meteor.methods({
    'accounts.inviteUser'(email) {
      check(email, String);
      const user = Meteor.user();
      if (!user || !user.isAdmin) throw new Meteor.Error('403', 'Permission denied');
      const userId = Accounts.createUser({ email });
      Accounts.sendEnrollmentEmail(userId);
    },
  });
};
