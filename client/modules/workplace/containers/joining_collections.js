import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import JoiningCollections from '../components/collection_fields/joining_collections.jsx';

export const composer = ({ context }, onData) => {
  const { LocalState } = context();
  const on = LocalState.get('SQL_QUERY_OBJECT').on;
  if (on) {
    onData(null, on);
  } else {
    onData(null, {});
  }
};

export const depsMapper = (context, actions) => ({
  updateSQLQueryObj: actions.workplaceState.updateSQLQueryObj,
  getSQLQueryObj: actions.workplaceState.getSQLQueryObj,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(JoiningCollections);
