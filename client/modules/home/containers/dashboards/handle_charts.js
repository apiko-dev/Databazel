import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import HandleCharts from '../../components/dashboards/handle_charts.jsx';
import Loading from '../../../core/components/partial/loading.jsx';

export const composer = ({ context, dashboard }, onData) => {
  const { Meteor, Collections } = context();

  if (Meteor.subscribe('charts.light').ready()) {
    const chartsToAdd = Collections.Charts.find({ _id: { $nin: dashboard.chartsId } });
    const isDashboardEmpty = !dashboard.chartsId.length;
    onData(null, { chartsToAdd, isDashboardEmpty, dashboardId: dashboard._id });
  }
};

export const depsMapper = (context, actions) => ({
  meteorMethodCall: actions.core.meteorMethodCall,
  routeTo: actions.core.routeTo,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer, () => <Loading />),
  useDeps(depsMapper)
)(HandleCharts);
