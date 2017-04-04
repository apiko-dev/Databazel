import { mount } from 'react-mounter';
import React from 'react';
import Chart from './containers/chart';
import ShareLayout from './components/share_layout';

export default function (injectDeps, { FlowRouter }) {
  const MainLayoutCtx = injectDeps(ShareLayout);
  FlowRouter.route('/publishing/chart/:chartId', {
    name: 'shareChart',
    action({ chartId }) {
      mount(MainLayoutCtx, {
        content: () => <Chart chartId={chartId} />,
      });
    },
  });
}
