import UsersList from '../components/users_list.jsx';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';

export const composer = ({ context }, onData) => {
  const { Meteor, FlowRouter } = context();
  if (Meteor.subscribe('users').ready()) {
    const users = Meteor.users.find().fetch();
    const inviteUser = () => FlowRouter.go('inviteUser');
    onData(null, { users, inviteUser });
  }
};

export const depsMapper = (context, actions) => ({
  inviteUser: actions.accounts.inviteUser,
  deleteUser: actions.admin.deleteUser,
  meteorMethodCall: actions.core.meteorMethodCall,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(UsersList);
