import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import i18n from 'meteor/universe:i18n';
import DataTypeMenu from '../preview/data_type_menu.jsx';
import AddObjectItem from './add_object_item.jsx';

const style = {
  dropDown: {
    iconBtn: {
      width: 0,
      height: 0,
      padding: 0,
      top: '-2px',
    },
    icon: {
      width: '18px',
      fontSize: '20px',
      color: '#616161',
    },
  },
};

class ObjectItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.dragField = this.dragField.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.updateDataType = this.updateDataType.bind(this);
    this.handelCloseContextMenu = this.handelCloseContextMenu.bind(this);
    this.handelOpenContextMenu = this.handelOpenContextMenu.bind(this);
  }
  dragEnd() {
    document.body.classList.remove('focus-elements');
  }
  dragField(e) {
    const field = JSON.stringify(this.props.data);
    const dragView = ReactDOM.findDOMNode(this.refs.draggedElement);
    document.body.classList.add('focus-elements');
    e.dataTransfer.setDragImage(dragView, 45, 15);
    e.dataTransfer.setData('text/plain', field);
  }
  updateDataType(e, index, value) {
    const { type, expression } = this.props.data;
    const newField = {
      currentType: value,
      type,
      expression,
    };
    this.props.updateCollectionField(newField);
  }
  handelOpenContextMenu(e) {
    e.preventDefault();
    if (this.props.data.type === 'object') {
      this.setState({
        open: true,
        anchorEl: e.currentTarget,
      });
    }
  }
  handelCloseContextMenu() {
    this.setState({ open: false });
  }
  render() {
    const { data, nestLevel, collectionField, updateObjectTree, onClick } = this.props;
    let objectSign;
    if (data.type === 'object') objectSign = '{}';
    if (data.type === 'array') objectSign = '[n]';
    return (
      <div
        className="object-tree-item-label backlightDrag"
        onContextMenu={this.handelOpenContextMenu}
        onClick={onClick}
        onDragStart={this.dragField}
        onDragEnd={this.dragEnd}
        draggable={!objectSign}
      >
        <span className={nestLevel < 1 ? 'object-tree-key collection' : 'object-tree-key'}>
          {data.name}:
        </span>

        <span className="text-muted">
          {nestLevel < 1 ? i18n.__('collection') :
            objectSign ||
              <DataTypeMenu
                value={(collectionField && collectionField.currentType) || data.type}
                allowedTypes={data.allowedTypes}
                onChange={this.updateDataType}
                dropDownStyle={style.dropDown}
                dropDownClassName="tree"
              />
          }
        </span>

        <div className="drag-container">
          <div ref="draggedElement" className="dragged-element">
            {data.name.toString()}
          </div>
        </div>

        {data.type === 'object' ?
          <AddObjectItem
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            branchData={data}
            closeMenu={this.handelCloseContextMenu}
            updateObjectTree={updateObjectTree}
          />
        : ''}
      </div>
    );
  }
}

ObjectItem.propTypes = {
  data: PropTypes.object.isRequired,
  nestLevel: PropTypes.number,
  collectionField: PropTypes.object,
  updateObjectTree: PropTypes.func,
  updateCollectionField: PropTypes.func,
};

export default ObjectItem;
