import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import { _ } from 'meteor/underscore';
import PreviewToolbar from '../../components/preview/preview_toolbar.jsx';

export const composer = ({ context, updateFieldType, fields }, onData) => {
  const { LocalState } = context();
  const state = LocalState.get('TOOLBAR_STATE');
  let currentField = _.find(fields, field => field.id === state);
  currentField = updateFieldType(currentField);
  onData(null, { currentField });
};

export const depsMapper = (context, actions) => ({
  updateSelectedField: actions.workplaceState.updateSelectedField,
  updateViewObj: actions.workplaceState.updateViewObj,
  updateFieldType: actions.collectionFields.updateFieldType,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(PreviewToolbar);
