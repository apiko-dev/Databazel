import HandleUsersMenuItem from '../../components/handle_users/handle_users_menu_item.jsx';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';

export const composer = ({ context, dashboardId: entityId }, onData) => {
  const { Meteor, Collections } = context();
  const props = { entityId, entityType: 'dashboard' };
  if (Meteor.subscribe('users').ready() && Meteor.subscribe('dashboards', entityId).ready()) {
    props.users = Meteor.users.find({ _id: { $ne: Meteor.userId() } }).fetch();
    props.selectedUsers = Collections.Dashboards.findOne(entityId).getUsersExceptCurrent();
  }
  onData(null, props);
};

export const depsMapper = (context, actions) => ({
  context: () => context,
  meteorMethodCall: actions.core.meteorMethodCall,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(HandleUsersMenuItem);
