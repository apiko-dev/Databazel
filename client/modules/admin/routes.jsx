import { mount } from 'react-mounter';
import React from 'react';
import CheckRole from '/client/modules/core/containers/check_role';
import UsersList from '/client/modules/admin/containers/users_list';
import CreatingUser from '/client/modules/accounts/containers/creating_user';
import Databases from '/client/modules/admin/containers/databases/databases';

export default function (injectDeps, { FlowRouter, MainLayout }) {
  const MainLayoutCtx = injectDeps(MainLayout);
  FlowRouter.route('/users-list', {
    name: 'usersList',
    action() {
      mount(MainLayoutCtx, {
        content: () => <CheckRole onlyAdmin><UsersList /></CheckRole>,
      });
    },
  });

  FlowRouter.route('/invite-user', {
    name: 'inviteUser',
    action() {
      mount(MainLayoutCtx, {
        content: () => <CheckRole onlyAdmin><CreatingUser type="email" /></CheckRole>,
      });
    },
  });

  FlowRouter.route('/databases', {
    name: 'databases',
    action() {
      mount(MainLayoutCtx, {
        content: () => <CheckRole onlyAdmin><Databases /></CheckRole>,
      });
    },
  });
}
