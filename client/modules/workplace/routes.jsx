import { mount } from 'react-mounter';
import React from 'react';
import Workplace from './containers/workplace.js';
import CheckRole from '/client/modules/core/containers/check_role';

export default function (injectDeps, { FlowRouter, MainLayout }) {
  const MainLayoutCtx = injectDeps(MainLayout);

  FlowRouter.route('/workplace/:dashboardId?', {
    name: 'workplace',
    action() {
      mount(MainLayoutCtx, {
        content: () => <CheckRole><Workplace /></CheckRole>,
      });
    },
  });
}
