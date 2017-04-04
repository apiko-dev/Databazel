import Workplace from '../components/workplace.jsx';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import { _ } from 'meteor/underscore';

export const composer = ({ context, setSQLQueryObj }, onData) => {
  const { Meteor, FlowRouter, LocalState, Collections } = context();
  const chartId = FlowRouter.getParam('chartId');

  if (chartId && Meteor.subscribe('charts', chartId).ready()) {
    const { queryObject, viewObject } = Collections.Charts.findOne({ _id: chartId });
    const tableType = !!viewObject.pivot ? 'pivot' : 'simple';
    const { chartType, query: savedQuery } = viewObject;
    parseCollectionFieldNames(queryObject.collectionFields);
    setSQLQueryObj(queryObject, tableType);
    LocalState.set('VIEW_OBJECT', viewObject);
    onData(null, { isSavedChart: true, tableType, chartType, savedQuery });
  }
  if (!chartId) {
    onData(null, { isSavedChart: false });
  }
};

export const depsMapper = (context, actions) => ({
  setSQLQueryObj: actions.workplaceState.setSQLQueryObj,
  updateSQLQueryObj: actions.workplaceState.updateSQLQueryObj,
  getStringSQLQuery: actions.console.getStringSQLQuery,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Workplace);

function parseCollectionFieldNames(collectionFields) {
  _.each(collectionFields, (field, name) => {
    collectionFields[name.replace(/\[dot]/g, '.')] = field;
    delete collectionFields[name];
  });
}
