import Collections from '../../components/collection_list/collections.jsx';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';

export const composer = ({ context, loadCollections }, onData) => {
  const { LocalState } = context();
  const database = LocalState.get('CURRENT_DATABASE');
  onData(null, { database });
};

export default composeAll(
  composeWithTracker(composer),
  useDeps()
)(Collections);
