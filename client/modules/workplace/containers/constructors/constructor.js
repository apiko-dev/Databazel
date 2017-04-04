import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import Constructor from '../../components/constructors/constructor.jsx';

export const composer = ({ context }, onData) => {
  const { LocalState } = context();
  const viewObj = LocalState.get('VIEW_OBJECT') || {};
  const queryObj = LocalState.get('SQL_QUERY_OBJECT') || {};
  onData(null, { viewObj, queryObj });
};

export const depsMapper = (context, actions) => ({
  addFieldToQueryObj: actions.workplaceState.addFieldToQueryObj,
  addCollectionField: actions.workplaceState.addCollectionField,
  updateCollectionField: actions.workplaceState.updateCollectionField,
  extendFieldData: actions.workplace.extendFieldData,
  getFilterFields: actions.preview.getFilterFields,
  addFieldToModelPart: actions.pivot.addFieldToModelPart,
  removeFieldFromModelPart: actions.pivot.removeFieldFromModelPart,
  canAddFieldToModelPart: actions.pivot.canAddFieldToModelPart,
  updateSelectedField: actions.workplaceState.updateSelectedField,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Constructor);
