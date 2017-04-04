import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import DataVisualisation from '../../components/dashboards/data_visualisation.jsx';
import Loading from '../../../core/components/partial/loading.jsx';
import { chartRefreshingDelaySeconds } from '/lib/constants';

export const composer = ({ context, chartId, meteorMethodCall }, onData) => {
  const { Meteor, Collections } = context();

  if (Meteor.subscribe('charts', chartId).ready()) {
    const chart = Collections.Charts.findOne({ _id: chartId });
    const { autorefresh, viewObject: { dataTimeStamp = 0 } } = chart;
    if (autorefresh && (Date.now() - dataTimeStamp > chartRefreshingDelaySeconds * 1000)) {
      meteorMethodCall('chart.refreshData', chartId, err => (err ? console.log(err) : null));
    } else {
      onData(null, { chart });
    }
  }
};

export const depsMapper = (context, actions) => ({
  context: () => context,
  meteorMethodCall: actions.core.meteorMethodCall,
  routeTo: actions.core.routeTo,
});

export default composeAll(
  composeWithTracker(composer, () => <Loading />),
  useDeps(depsMapper)
)(DataVisualisation);
