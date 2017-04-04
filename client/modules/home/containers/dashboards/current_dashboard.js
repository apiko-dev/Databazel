import React from 'react';
import { composeWithTracker, composeAll, useDeps } from 'mantra-core';

const composer = ({ context }, onData) => {
  const { Meteor, FlowRouter, Collections } = context();
  const routeName = FlowRouter.getRouteName();

  if (routeName === 'dashboard') {
    const dashboardId = FlowRouter.getParam('dashboardId');

    if (dashboardId && Meteor.subscribe('dashboards', dashboardId).ready()) {
      const dashboard = Collections.Dashboards.findOne({ _id: dashboardId });
      onData(null, { dashboard });
    }
  }
  onData(null, {});
};

export const depsMapper = (context, actions) => ({
  meteorMethodCall: actions.core.meteorMethodCall,
  routeTo: actions.core.routeTo,
  context: () => context,
});

export default (component) => composeAll(
  composeWithTracker(composer, () => <i></i>),
  useDeps(depsMapper)
)(component);
