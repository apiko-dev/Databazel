import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import DropField from '../components/partial/drop_field.jsx';

export const composer = ({ content }, onData) => {
  onData(null, {});
};

export const depsMapper = (context, actions) => ({
  addFieldToQueryObj: actions.workplaceState.addFieldToQueryObj,
  addFieldToModelPart: actions.pivot.addFieldToModelPart,
  extendFieldData: actions.workplace.extendFieldData,
  canAddFieldToChart: actions.preview.canAddFieldToChart,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(DropField);
