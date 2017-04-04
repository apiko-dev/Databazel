import React, { PropTypes } from 'react';
import TextInput from '/client/single_components/form_fields/text_input.jsx';
import ExpressionField from './expression_field.jsx';
import FilterButton from './../filters/filter_button.jsx';
import GroupingButton from './grouping_button.jsx';
import DataTypeMenu from './data_type_menu.jsx';
import i18n from 'meteor/universe:i18n';
import { cyan500, grey300 } from 'material-ui/styles/colors';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

const style = {
  toolbar: {
    height: '48px',
    backgroundColor: grey300,
  },
  toolbarGroup: {
    width: '100%',
  },
  toolbarTitle: {
    lineHeight: '48px',
  },
  active: {
    color: cyan500,
  },
  dropDown: {
    iconBtn: {
      zIndex: 1101,
    },
  },
  filterBtn: {
    zIndex: 1101,
  },
};

class PreviewToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.updateCurrentField = this.updateCurrentField.bind(this);
    this.updateDataType = this.updateDataType.bind(this);
    this.updateName = this.updateName.bind(this);
    this.updateExpression = this.updateExpression.bind(this);
  }
  updateCurrentField(processField) {
    const { currentField, updateSelectedField } = this.props;
    const newField = processField(currentField);
    updateSelectedField(newField);
  }
  updateExpression(e) {
    this.updateCurrentField((currentField) => {
      const input = e.currentTarget;
      if (!input || currentField.expression === input.value) return null;
      currentField.expression = input.value;
      currentField.isTypeChanged = false;
      currentField.currentType = currentField.type;
      return currentField;
    });
  }
  updateName(e) {
    this.updateCurrentField((currentField) => {
      const input = e.currentTarget;
      if (!input || currentField.name === input.value) return null;
      currentField.name = input.value;
      return currentField;
    });
  }
  updateDataType(e, index, value) {
    this.updateCurrentField((currentField) => {
      currentField.currentType = value;
      currentField.isTypeChanged = true;
      return currentField;
    });
  }

  render() {
    const { currentField } = this.props;
    return (
      <div className="preview-toolbar">
        <Toolbar style={style.toolbar}>
          {currentField ?
            <ToolbarGroup style={style.toolbarGroup}>
              <TextInput
                hintText="name"
                value={currentField.name}
                onBlur={this.updateName}
              />
              {/* <DataTypeMenu
                value={currentField.currentType}
                onChange={this.updateDataType}
                dropDownStyle={style.dropDown}
                tooltip={i18n.__('data_type')}
              />*/}
              <GroupingButton
                currentType={currentField.currentType}
                grouping={currentField.grouping}
                updateCurrentField={this.updateCurrentField}
                allowNotGrouping
              />
              <FilterButton
                type={currentField.currentType}
                filters={currentField.filters}
                field={currentField.name}
                updateCurrentField={this.updateCurrentField}
                disable="date"
                buttonStyle={style.filterBtn}
                tooltipPosition="top-center"
              />
              <ExpressionField
                value={currentField.expression}
                onChange={this.updateExpression}
              />
            </ToolbarGroup>
            :
            <ToolbarGroup style={style.toolbarGroup}>
              <ToolbarTitle text="Preview" style={style.toolbarTitle} />
            </ToolbarGroup>
          }
        </Toolbar>
      </div>
    );
  }
}

PreviewToolbar.propTypes = {
  currentField: PropTypes.object,
  updateSelectedField: PropTypes.func,
  dataTypeMenuOptions: PropTypes.array,
};

export default PreviewToolbar;
