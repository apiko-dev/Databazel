import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import TreeView from 'react-treeview';

import ObjectItem from './object_item.jsx';
import JoiningFields from '../../containers/joining_collections';

const parseObj = obj => {
  const parsedObj = obj;
  if (parsedObj.nestedData) {
    parsedObj.isCollapsed = true;
    parsedObj.nestedData = parsedObj.nestedData.map(parseObj);
    return parsedObj;
  }
  return obj;
};

const findFirstIndex = (data, collectionName) => {
  return data.findIndex(innerArray =>
    innerArray.some(collection =>
      collection.name === collectionName
    )
  );
};

const toggleCollapse = (data, expression) => {
  const path = expression.split('.');
  const firstIndex = findFirstIndex(data, path[0]);
  let link = data[firstIndex][0];

  path.shift();
  if (path.length) {
    path.forEach(name => {
      link = link.nestedData.find(nestedElement =>
        nestedElement.name === name.replace(new RegExp('\`', 'g'), ''));
    });
  }

  link.isCollapsed = !link.isCollapsed;

  return data;
};

class CollectionFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: props.data ? props.data.map(d => d.map(parseObj)) : [] };
    this.treeView = this.treeView.bind(this);
    this.updateObjectTree = this.updateObjectTree.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.data && nextProps.data.map(d => d.map(parseObj)), this.state.data)) {
      this.setState({ data: nextProps.data });
    }
  }
  treeView(data, i, nestLevel) {
    const { collectionFields, updateCollectionField } = this.props;
    const nextLevel = nestLevel + 1;
    const collectionField = collectionFields ? collectionFields[data.expression] : null;

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
        collapsed={data.isCollapsed}
        onClick={() => this.handleClick(data)}
      >
        {data.nestedData && data.nestedData.map((item, j) => this.treeView(item, j, nextLevel))}
      </TreeView>
    );
  }
  handleClick(field) {
    if (field.nestedData) {
      const { data } = this.state;
      const newData = toggleCollapse(data, field.expression);
      this.setState({ data: newData });
    }
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
