import CollectionFields from '../components/collection_fields/collection_fields.jsx';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';

export const composer = ({ context, getSQLQueryObj, prePreviewState, changeCollectionState }, onData) => {
  const { LocalState } = context();
  const { collectionFields, from, join } = LocalState.get('SQL_QUERY_OBJECT') || {};
  if (!from) return changeCollectionState(true);
  onData(null, { collections: { from, join }, collectionFields });
};

export const depsMapper = (context, actions) => ({
  getSQLQueryObj: actions.workplaceState.getSQLQueryObj,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(CollectionFields);
