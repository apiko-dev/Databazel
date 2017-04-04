import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import ColorValuesItem from '../../components/context_menu/color_values.jsx';

export const composer = ({ context }, onData) => {
  const { LocalState } = context();
  const { pivot } = LocalState.get('VIEW_OBJECT');
  onData(null, { pivot });
};

export const depsMapper = (context, actions) => ({
  updateViewObj: actions.workplaceState.updateViewObj,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(ColorValuesItem);
