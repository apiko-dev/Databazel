import React from 'react';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import ChartsList from '../../components/charts/list.jsx';

export const composer = ({ context }, onData) => {
  const { Meteor, Collections } = context();
  if (Meteor.subscribe('charts').ready()) {
    const charts = Collections.Charts.find({}).fetch();
    onData(null, { charts });
  }
};

export const depsMapper = (context, actions) => ({
  routeTo: actions.core.routeTo,
  meteorMethodCall: actions.core.meteorMethodCall,
  exportDataToCsv: actions.charts.exportDataToCsv,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer, () => <i />),
  useDeps(depsMapper)
)(ChartsList);
