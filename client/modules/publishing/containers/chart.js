import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import Loading from '/client/modules/core/components/partial/loading.jsx';
import Chart from '../components/chart';

export const composer = ({ context, chartId }, onData) => {
  const { Meteor, Collections } = context();
  if (Meteor.subscribe('charts.published', chartId).ready()) {
    const chart = Collections.Charts.findOne({ _id: chartId });
    if (chart) onData(null, { chart });
    else onData(null, {});
  }
};

export const depsMapper = (context) => ({
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer, () => <Loading />),
  useDeps(depsMapper)
)(Chart);
