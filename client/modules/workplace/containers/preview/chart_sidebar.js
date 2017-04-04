import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import ChartSidebar from '../../components/preview/chart_sidebar.jsx';

export const composer = ({ context }, onData) => {
  const { FlowRouter, Meteor, Collections } = context();
  const chartId = FlowRouter.getParam('chartId');
  if (Meteor.subscribe('charts.light', chartId).ready()) {
    const chart = Collections.Charts.findOne({ _id: chartId });
    const isPublished = chart ? chart.isPublished : false;
    onData(null, { chartId, isPublished });
  } else onData(null, { chartId });
};

export const depsMapper = (context, actions) => ({
  updateViewObj: actions.workplaceState.updateViewObj,
  setSQLQuery: actions.workplaceState.setSQLQuery,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(ChartSidebar);
