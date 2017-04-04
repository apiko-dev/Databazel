import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import PreviewHeader from '../../components/preview/preview_header.jsx';

export const composer = ({ context, getConstructorFields, fields, chartType }, onData) => {
  const constructorFields = getConstructorFields(fields, chartType);
  onData(null, { fields: constructorFields });
};

export const depsMapper = (context, actions) => ({
  updateSQLQueryObj: actions.workplaceState.updateSQLQueryObj,
  getSQLQueryObj: actions.workplaceState.getSQLQueryObj,
  updateToolbarState: actions.workplaceState.updateToolbarState,
  deleteField: actions.workplaceState.deleteField,
  updateSelectedField: actions.workplaceState.updateSelectedField,
  extendFieldData: actions.workplace.extendFieldData,
  getConstructorFields: actions.preview.getConstructorFields,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(PreviewHeader);
