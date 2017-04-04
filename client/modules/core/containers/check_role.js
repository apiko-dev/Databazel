import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import React from 'react';
import CheckRole from '../components/partial/check_role.jsx';
import Loading from '../../core/components/partial/loading.jsx';


export const composer = ({ context, onlyAdmin }, onData) => {
  const { Meteor } = context();
  if (Meteor.subscribe('user').ready()) {
    const user = Meteor.user();
    let canRender;

    if (onlyAdmin) {
      canRender = user && user.isAdmin;
    } else {
      canRender = !!user;
    }
    onData(null, { canRender });
  }
};

export const depsMapper = (context, actions) => ({
  redirectToLogin: actions.core.redirectToLogin,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer, () => <Loading />),
  useDeps(depsMapper)
)(CheckRole);
