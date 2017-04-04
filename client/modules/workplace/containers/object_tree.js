import React from 'react';
import Loading from '/client/modules/core/components/partial/loading.jsx';
import ObjectTree from '../components/collection_fields/object_tree.jsx';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import { _ } from 'meteor/underscore';

export const composer = ({ collections, processFieldsData, collectionFields,
  getAvailableCollectionFields, togglePreview, prePreviewState }, onData) => {
  if (!_.isEmpty(collections)) {
    getAvailableCollectionFields(_.compact(_.values(collections)), (err, collectionsFields) => {
      if (err) return onData(null, {});
      if (prePreviewState !== !_.isEmpty(collectionsFields)) togglePreview(!prePreviewState);

      const data = collectionsFields.map(fields => processFieldsData(fields));
      onData(null, { data, collectionFields });
    });
  }
};

export const depsMapper = (context, actions) => ({
  getAvailableCollectionFields: actions.collectionFields.getAvailableCollectionFields,
  processFieldsData: actions.collectionFields.processFieldsData,
  updateCollectionField: actions.workplaceState.updateCollectionField,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer, () => <Loading centered />),
  useDeps(depsMapper)
)(ObjectTree);
