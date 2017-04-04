import React from 'react';
import CollectionList from '../../components/collection_list/collection_list.jsx';
import Loading from '/client/modules/core/components/partial/loading.jsx';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';

export const composer = ({ context, loadCollections, database }, onData) => {
  onData(null, null);
  loadCollections(database, data => {
    onData(null, { collections: data });
  });
};

export const depsMapper = (context, actions) => ({
  setSQLQueryObj: actions.workplaceState.setSQLQueryObj,
  loadCollections: actions.workplace.loadCollections,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer, () => <Loading centered />),
  useDeps(depsMapper)
)(CollectionList);
