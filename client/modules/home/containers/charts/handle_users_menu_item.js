import HandleUsersMenuItem from '../../components/handle_users/handle_users_menu_item.jsx';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';

export const composer = ({ context, chartId: entityId }, onData) => {
  const { Meteor, Collections } = context();
  const props = {
    entityId,
    entityType: 'chart',
  };
  if (Meteor.subscribe('users').ready() && Meteor.subscribe('charts.light', entityId).ready()) {
    props.users = Meteor.users.find({ _id: { $ne: Meteor.userId() } }).fetch();
    props.selectedUsers = Collections.Charts.findOne(entityId).getUsersExceptCurrent();
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
