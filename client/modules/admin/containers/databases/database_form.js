import React from 'react';
import DatabaseForm from '../../components/databases/database_form.jsx';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';

export const composer = ({ context, database }, onData) => {
  const { Meteor } = context();
  if (database) {
    Meteor.call('quasar.getMount', database.name, (err, mount) => {
      database.mongoUri = mount.connectionUri;
      onData(null, { database });
    });
  } else {
    onData(null, {});
  }
};

export default composeAll(
  composeWithTracker(composer, () => <i></i>),
  useDeps()
)(DatabaseForm);
