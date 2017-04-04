import React from 'react';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import DatabasesDropDown from '../components/partial/database_drop_down.jsx';

export const composer = ({ context, checkQuasarConnection }, onData) => {
  const { Meteor, LocalState, Collections, FlowRouter } = context();
  const chartId = FlowRouter.getParam('chartId');
  const chart = chartId ? Collections.Charts.findOne(chartId) : null;
  if (chartId && !chart) return;

  Meteor.call('quasar.getMetadata', '/', (err, databases) => {
    if (!checkQuasarConnection(err, databases)) return;
    if (chartId) {
      LocalState.set('CURRENT_DATABASE', chart.database);
      if (databases.length > 1) onData(null, { databases, current: chart.database.mount });
    } else {
      const currentDatabase = LocalState.get('CURRENT_DATABASE') || {};
      const mountName = currentDatabase.mount || databases[0].name;

      Meteor.call('quasar.getMount', mountName, (err2, mount) => {
        if (err) return;
        const databaseName = mount.connectionUri.match(/[\w_\-\d]+?$/)[0];
        LocalState.set('CURRENT_DATABASE', { mount: mountName, name: databaseName });
        if (databases.length > 1) onData(null, { databases, current: mountName });
      });
    }
  });
};

export const depsMapper = (context, actions) => ({
  changeDatabase: actions.core.changeDatabase,
  checkQuasarConnection: actions.core.checkQuasarConnection,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer, () => <i></i>),
  useDeps(depsMapper)
)(DatabasesDropDown);
