import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import {
  FlatButton, TextField, SelectField, MenuItem, Dialog, Popover, Menu,
} from 'material-ui';

import { fieldTypes } from '/lib/constants';

const styles = {
  fieldName: {
    width: 'calc(100% - 212px)',
  },
  fieldType: {
    top: '15px',
    width: '200px',
    marginLeft: '12px',
  },
};

class AddObjectItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDialogOpened: false,
      typeFieldValue: fieldTypes[0],
    };
    this.submitNewField = this.submitNewField.bind(this);
    this.renderDialogActions = this.renderDialogActions.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.openDialog = this.openDialog.bind(this);
  }
  closeDialog() {
    this.setState({ isDialogOpened: false });
  }
  openDialog() {
    this.props.closeMenu();
    this.setState({ isDialogOpened: true });
  }
  submitNewField() {
    const { branchData, updateObjectTree } = this.props;
    const fieldName = this.refs.fieldName.getValue();
    const fieldType = this.state.typeFieldValue;

    if (fieldName) {
      const parsedFieldName = !!~fieldName.indexOf(' ') ? `\`${fieldName}\`` : fieldName;
      branchData.nestedData.push({
        expression: `${branchData.expression}.${parsedFieldName}`,
        name: fieldName,
        type: fieldType,
        nestedData: fieldType === 'object' || fieldType === 'array' ? [] : null,
      });
      updateObjectTree();
    }
    this.closeDialog();
  }
  renderDialogActions() {
    return [
      <FlatButton
        label="Cancel"
        onTouchTap={this.closeDialog}
      />,
      <FlatButton
        label="OK"
        onTouchTap={this.submitNewField}
        keyboardFocused
        primary
      />,
    ];
  }
  render() {
    const { open, anchorEl, closeMenu } = this.props;
    return (
      <div>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onRequestClose={closeMenu}
        >
          <Menu>
            <MenuItem primaryText={i18n.__('add_field')} onClick={this.openDialog} />
          </Menu>
        </Popover>
        <Dialog
          title={i18n.__('add_collection_field')}
          actions={this.renderDialogActions()}
          open={this.state.isDialogOpened}
          onRequestClose={this.closeDialog}
          modal={false}
        >
          <form ref="addFieldForm">
            <TextField
              floatingLabelText={i18n.__('field_name')}
              style={styles.fieldName}
              ref="fieldName"
            />
            <SelectField
              value={this.state.typeFieldValue}
              floatingLabelText={i18n.__('field_type')}
              onChange={(e, key, value) => this.setState({ typeFieldValue: value })}
              style={styles.fieldType}
              ref="fieldType"
            >
              {fieldTypes.map(type => (
                <MenuItem
                  value={type}
                  primaryText={i18n.__(type)}
                  key={type}
                />
              ))}
            </SelectField>
          </form>
        </Dialog>
      </div>
    );
  }
}

AddObjectItem.propTypes = {
  open: PropTypes.bool,
  branchData: PropTypes.object,
  anchorEl: PropTypes.object,
  closeMenu: PropTypes.func,
  updateObjectTree: PropTypes.func,
};

export default AddObjectItem;
