import { Accounts } from 'meteor/accounts-base';

export default {
  signIn({ Meteor, LocalState, FlowRouter }, email, password) {
    Meteor.loginWithPassword(email, password, (err) => {
      if (err && err.reason) {
        LocalState.set('LOGIN_ERROR', err.reason);
      } else {
        FlowRouter.go('home');
      }
    });
  },
  inviteUser({ Meteor, LocalState, FlowRouter }, email) {
    Meteor.call('accounts.inviteUser', email, (err) => {
      if (err && err.reason) {
        LocalState.set('CREATING_USER_ERROR', err.reason);
      } else {
        FlowRouter.go('home');
      }
    });
  },
  resetPassword({ FlowRouter, LocalState }, newPassword, token) {
    Accounts.resetPassword(token, newPassword, (err) => {
      if (err && err.reason) {
        LocalState.set('CREATING_USER_ERROR', err.reason);
      } else {
        FlowRouter.go('home');
      }
    });
  },
};
