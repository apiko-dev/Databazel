import HandleDashboards from '../../components/charts/handle_dashboards.jsx';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import { _ } from 'meteor/underscore';

export const composer = ({ context, chartId }, onData) => {
  const { Meteor, Collections } = context();
  if (Meteor.subscribe('dashboards').ready()) {
    const dashboards = Collections.Dashboards.find({}, { fields: { name: 1, chartsId: 1 } });
    const parsedDashboards = dashboards.map(board => (
      _.extend(board, { added: !!~_.indexOf(board.chartsId, chartId) })
    ));
    const isNoDashboardsAdded = !_.findWhere(parsedDashboards, { added: true });
    onData(null, { parsedDashboards, chartId, isNoDashboardsAdded });
  } else {
    onData(null, { chartId });
  }
};

export const depsMapper = (context, actions) => ({
  context: () => context,
  meteorMethodCall: actions.core.meteorMethodCall,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(HandleDashboards);
