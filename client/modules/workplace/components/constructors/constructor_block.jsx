import React, { PropTypes } from 'react';
import { Divider } from 'material-ui';
import i18n from 'meteor/universe:i18n';
import ConstructorBlockFieldItem from './constructor_block_field_item.jsx';
import { List } from 'material-ui/List';
import ContextMenu from '/client/modules/core/components/context_menu/context_menu.jsx';
import FormatNumberItem from '/client/modules/core/containers/context_menu/format_number';
import ColorValuesItem from '/client/modules/core/containers/context_menu/color_values';

const styles = {
  list: {
    margin: '-8px 0px',
    overflow: 'hidden',
  },
};

class ConstructorBlock extends React.Component {
  constructor(props) {
    super(props);
    this.dropField = this.dropField.bind(this);
    this.getContextMenuItems = this.getContextMenuItems.bind(this);
  }

  getContextMenuItems(field) {
    const { label } = this.props;
    const items = [];
    if (field.type === 'number') items.push(FormatNumberItem);
    if (label === 'values') items.push(ColorValuesItem);
    return items;
  }

  dropField(e) {
    const { handleDroppedField, label } = this.props;
    const initData = JSON.parse(e.dataTransfer.getData('text/plain'));
    handleDroppedField(initData, label);
  }

  render() {
    const { label, fields, action, deleteField, filterFunc } = this.props;
    return (
      <div
        className="col-xs-12 constructor-part backlight col-md-6"
        onDrop={this.dropField}
        onDragOver={e => e.preventDefault()}
      >
        <div className="part-name">{i18n.__(label)}</div>
        <Divider />
        <List style={styles.list}>
          {fields && fields.map((field, i) => (
            <ContextMenu
              key={i}
              contextMenuItems={this.getContextMenuItems(field)}
              itemsParams={{ field }}
            >
              <ConstructorBlockFieldItem
                label={label}
                field={field}
                action={action}
                deleteField={deleteField}
                filterFunc={filterFunc}
              />
            </ContextMenu>
          ))}
        </List>
      </div>
    );
  }
}

ConstructorBlock.propTypes = {
  label: PropTypes.string,
  fields: PropTypes.array,
  action: PropTypes.object,
  needActions: PropTypes.array,
  handleDroppedField: PropTypes.func,
  deleteField: PropTypes.func,
  filterFunc: PropTypes.func,
};

export default ConstructorBlock;
