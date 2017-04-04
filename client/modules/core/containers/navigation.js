import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import Navigation from '../components/partial/navigation.jsx';

export const composer = ({ context }, onData) => {
  const { FlowRouter } = context();
  const currentRoute = FlowRouter.getRouteName();
  onData(null, { currentRoute });
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(Navigation);
