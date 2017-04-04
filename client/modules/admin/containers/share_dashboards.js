import ShareDashboards from '../components/share_dashboards.jsx';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import { _ } from 'meteor/underscore';

export const composer = ({ context, userId }, onData) => {
  const { Meteor, Collections } = context();
  if (Meteor.subscribe('dashboards').ready()) {
    const dashboards = Collections.Dashboards.find({}).fetch();
    const selectedDashboards = dashboards.reduce((previous, board) => {
      if (!!~board.users.indexOf(userId)) previous.push(board._id);
      return previous;
    }, []);
    const defaultDashboards = _.clone(selectedDashboards);
    onData(null, { dashboards, selectedDashboards, defaultDashboards, userId });
  } else {
    onData(null, { userId });
  }
};

export const depsMapper = (context, actions) => ({
  context: () => context,
  shareDashboards: actions.admin.shareDashboards,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(ShareDashboards);
