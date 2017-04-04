import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import Loading from '../../../core/components/partial/loading.jsx';
import DashboardsList from '../../components/dashboards/list.jsx';

export const composer = ({ context }, onData) => {
  const { Meteor, Collections } = context();
  if (Meteor.subscribe('dashboards').ready()) {
    const dashboards = Collections.Dashboards.find().fetch();
    onData(null, { dashboards });
  } else {
    const isLoading = true;
    onData(null, { isLoading });
  }
};

export const depsMapper = (context, actions) => ({
  renameDashboard: actions.dashboard.renameDashboard,
  routeTo: actions.core.routeTo,
  meteorMethodCall: actions.core.meteorMethodCall,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer, () => <Loading />),
  useDeps(depsMapper)
)(DashboardsList);
