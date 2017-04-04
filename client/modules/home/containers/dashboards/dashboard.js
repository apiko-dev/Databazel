import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import Dashboard from '../../components/dashboards/dashboard.jsx';
import Loading from '../../../core/components/partial/loading.jsx';

export const composer = ({ context }, onData) => {
  const { Meteor, FlowRouter, Collections } = context();
  const dashboardId = FlowRouter.getParam('dashboardId');

  const isDashboardsReady = Meteor.subscribe('dashboards', dashboardId).ready();
  const isChartsReady = Meteor.subscribe('charts').ready();
  const isChartsLocationsReady = Meteor.subscribe('chartsLocations').ready();

  if (isChartsReady && isDashboardsReady && isChartsLocationsReady) {
    const dashboard = Collections.Dashboards.findOne({ _id: dashboardId });
    if (dashboard) {
      Meteor.defer(() => {
        dashboard.chartsId = dashboard.getSharedChartsId();
        const chartsLocations = Collections.ChartsLocations
          .find({ dashboardId, userId: Meteor.userId() });
        onData(null, { dashboard, chartsLocations });
      });
    }
  }
};

export const depsMapper = (context, actions) => ({
  meteorMethodCall: actions.core.meteorMethodCall,
  saveLayouts: actions.dashboard.saveLayouts,
  parseChartsLocations: actions.dashboard.parseChartsLocations,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer, () => <Loading />),
  useDeps(depsMapper)
)(Dashboard);
