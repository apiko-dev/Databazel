import React from 'react';
import Databases from '../../components/databases/databases.jsx';
import Loading from '/client/modules/core/components/partial/loading.jsx';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';

export const composer = ({ context }, onData) => {
  const { Meteor } = context();
  Meteor.call('quasar.getMetadata', '/', (err, mounts) => {
    if (err) return onData(null, { isQuasarError: true });
    return onData(null, { databases: mounts });
  });
};

export const depsMapper = (context, actions) => ({
  createDatabase: actions.databases.createDatabase,
  deleteDatabase: actions.databases.deleteDatabase,
  updateDatabase: actions.databases.updateDatabase,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer, () => <Loading />),
  useDeps(depsMapper)
)(Databases);
