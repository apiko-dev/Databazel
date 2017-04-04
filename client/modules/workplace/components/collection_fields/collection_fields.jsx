import React, { PropTypes } from 'react';
import ObjectTree from '../../containers/object_tree';
import { _ } from 'meteor/underscore';

class CollectionFields extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props.collections, nextProps.collections);
  }
  render() {
    const { collections, togglePreview, prePreviewState } = this.props;
    return (
      <ObjectTree
        collections={collections}
        togglePreview={togglePreview}
        prePreviewState={prePreviewState}
      />
    );
  }
}

CollectionFields.propTypes = {
  prePreviewState: PropTypes.bool,
  collectionsFields: PropTypes.array,
  collections: PropTypes.object,
  togglePreview: PropTypes.func,
};

export default CollectionFields;
