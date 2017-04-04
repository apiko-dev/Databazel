import HandleUsers from '../../components/charts/handle_users.jsx';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';

export const composer = ({ context, chartId }, onData) => {
  const { Meteor } = context();
  if (Meteor.subscribe('users').ready()) {
    const users = Meteor.users
      .find({ _id: { $ne: Meteor.userId() } }, { fields: { name: 1, chartsId: 1, emails: 1 } })
      .fetch();
    onData(null, { users, chartId });
  } else {
    onData(null, { chartId });
  }
};

export const depsMapper = (context, actions) => ({
  context: () => context,
  meteorMethodCall: actions.core.meteorMethodCall,
  handleUsersAddedToChart: actions.charts.handleUsersAddedToChart,
  getDashboardsForUserChart: actions.charts.getDashboardsForUserChart,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(HandleUsers);
