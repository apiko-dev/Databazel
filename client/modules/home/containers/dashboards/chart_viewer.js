import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import ChartViewer from '../../components/dashboards/presentation_mode/chart_viewer.jsx';
import Loading from '../../../core/components/partial/loading.jsx';

export const composer = ({ context, dashboard }, onData) => {
  const { Meteor, Collections } = context();

  if (Meteor.subscribe('charts').ready()) {
    const charts = Collections.Charts.find({ _id: { $in: dashboard.chartsId } });
    onData(null, { charts });
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
)(ChartViewer);
