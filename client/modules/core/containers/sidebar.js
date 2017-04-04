import React from 'react';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import Sidebar from '../components/partial/sidebar.jsx';

export const composer = ({ context, open, getSidebarItemsList }, onData) => {
  const { Meteor, FlowRouter } = context();
  if (Meteor.subscribe('dashboards').ready() && Meteor.subscribe('charts.light').ready()) {
    const user = Meteor.user();
    const { list: dashboards } = getSidebarItemsList({ listName: 'dashboards', limit: 5 });
    const { list: charts, currentRouteName, currentParam } =
      getSidebarItemsList({ listName: 'charts', limit: 7 });
    const props = { dashboards, charts, open, currentRouteName, currentParam, user };

    if (user) props.logout = () => Meteor.logout(() => FlowRouter.go('accounts.signIn'));
    onData(null, props);
  }
};

export const depsMapper = (context, actions) => ({
  context: () => context,
  routeTo: actions.core.routeTo,
  getSidebarItemsList: actions.core.getSidebarItemsList,
});

export default composeAll(
  composeWithTracker(composer, () => <i></i>),
  useDeps(depsMapper)
)(Sidebar);

