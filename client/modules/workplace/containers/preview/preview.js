import Preview from '../../components/preview/preview.jsx';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';

export const composer = ({ context, getStringSQLQuery }, onData) => {
  const { LocalState } = context();
  const queryObject = LocalState.get('SQL_QUERY_OBJECT') || {};
  const viewObject = LocalState.get('VIEW_OBJECT') || {};

  viewObject.query = getStringSQLQuery(queryObject);
  onData(null, { queryObject, viewObject });
};

export const depsMapper = (context, actions) => ({
  getStringSQLQuery: actions.console.getStringSQLQuery,
  checkChangingQuery: actions.preview.checkChangingQuery,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(Preview);
