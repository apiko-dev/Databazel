import React from 'react';
import { mount } from 'react-mounter';
import SignIn from './containers/sign_in';
import CreatingUser from './containers/creating_user';

export default function (injectDeps, { FlowRouter, MainLayout }) {
  const MainLayoutCtx = injectDeps(MainLayout);
  const accountRoutes = FlowRouter.group({
    prefix: '/accounts',
    name: 'accounts',
  });

  accountRoutes.route('/sign-in', {
    name: 'accounts.signIn',
    action() {
      mount(MainLayoutCtx, {
        content: () => <SignIn />,
      });
    },
  });

  accountRoutes.route('/reset-password/:token', {
    name: 'accounts.resetPassword',
    action() {
      mount(MainLayoutCtx, {
        content: () => <CreatingUser type="password" />,
      });
    },
  });
}
