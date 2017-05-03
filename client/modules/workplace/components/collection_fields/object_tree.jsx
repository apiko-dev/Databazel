import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import TreeView from 'react-treeview';

import ObjectItem from './object_item.jsx';
import JoiningFields from '../../containers/joining_collections';

const getFieldPath = (field) => {
  if (typeof field === 'string') {
    return field;
  } else if (typeof field === 'object') {
    return field.nestedData ? field.expression : null;
  }
  return null;
};

class CollectionFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      openItems: [],
    };
    this.treeView = this.treeView.bind(this);
    this.updateObjectTree = this.updateObjectTree.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.data, this.state.data)) {
      this.setState({ data: nextProps.data });
    }
  }
  isCollapsed(field) {
    return !~this.state.openItems.indexOf(getFieldPath(field));
  }
  treeView(data, i, nestLevel) {
    const { collectionFields, updateCollectionField } = this.props;
    const nextLevel = nestLevel + 1;
    const field = data.expression;
    const collectionField = collectionFields ? collectionFields[field] : null;

    return (
      <TreeView
        key={`${i}-${nestLevel}`}
        nodeLabel={
          <ObjectItem
            data={data}
            collectionField={collectionField}
            nestLevel={nestLevel}
            updateObjectTree={this.updateObjectTree}
            updateCollectionField={updateCollectionField}
            onClick={() => this.handleClick(data)}
          />
        }
        itemClassName={
          !data.nestedData ? `no-arrow nest-level-${nextLevel}` : `nest-level-${nextLevel}`
        }
        collapsed={this.isCollapsed(field)}
        onClick={() => this.handleClick(field)}
      >
        {data.nestedData && data.nestedData.map((item, j) => this.treeView(item, j, nextLevel))}
      </TreeView>
    );
  }
  handleClick(field) {
    const fieldPath = getFieldPath(field);
    if (!fieldPath) return;

    const { openItems } = this.state;
    const newItems = this.isCollapsed(fieldPath)
      ? openItems.concat([fieldPath])
      : openItems.filter(p => p !== fieldPath);
    this.setState({
      openItems: newItems,
    });
  }
  updateObjectTree() {
    this.setState({ data: this.state.data });
  }
  render() {
    const { data } = this.state;
    if (!data) return null;
    const nestLevel = 0;
    return (
      <div className="collection-fields">
        {data && data.map((fields, i) => (
          <div key={i}>
            {i > 0 ?
              <JoiningFields />
            : ''}
            <div className="object-tree">
              {fields.map((field, j) => (
                this.treeView(field, j, nestLevel)
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

CollectionFields.propTypes = {
  data: PropTypes.array,
  collectionFields: PropTypes.object,
  updateCollectionField: PropTypes.func,
};

export default CollectionFields;
