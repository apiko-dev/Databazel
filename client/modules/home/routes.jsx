import { mount } from 'react-mounter';
import React from 'react';
import Home from './containers/home';
import ChartsList from './containers/charts/list';
import Dashboard from './containers/dashboards/dashboard.js';
import Workplace from '../workplace/containers/workplace.js';
import CheckRole from '/client/modules/core/containers/check_role';

export default function (injectDeps, { FlowRouter, MainLayout }) {
  const MainLayoutCtx = injectDeps(MainLayout);

  FlowRouter.route('/', {
    name: 'home',
    action() {
      mount(MainLayoutCtx, {
        content: () => <CheckRole><Home /></CheckRole>,
      });
    },
  });

  FlowRouter.route('/charts', {
    name: 'charts',
    action() {
      mount(MainLayoutCtx, {
        content: () => <CheckRole><ChartsList /></CheckRole>,
      });
    },
  });

  FlowRouter.route('/dashboard/:dashboardId', {
    name: 'dashboard',
    action() {
      mount(MainLayoutCtx, {
        content: () => <CheckRole><Dashboard /></CheckRole>,
      });
    },
  });
  FlowRouter.route('/chart/:chartId', {
    name: 'chartEditor',
    action() {
      mount(MainLayoutCtx, {
        content: () => <CheckRole><Workplace /></CheckRole>,
      });
    },
  });
}
