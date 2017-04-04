import React, { PropTypes } from 'react';
import AggFuncIconMenu from '/client/modules/core/components/partial/agg_func_icon_menu.jsx';
import ConstructorBlock from './constructor_block.jsx';
import GroupingButton from '../preview/grouping_button.jsx';

class Constructor extends React.Component {
  constructor(props) {
    super(props);
    this.dropField = this.dropField.bind(this);
    this.dropFilterField = this.dropFilterField.bind(this);
    this.deleteFilterField = this.deleteFilterField.bind(this);
    this.getAggFuncAction = this.getAggFuncAction.bind(this);
    this.getGroupDateAction = this.getGroupDateAction.bind(this);
  }

  getGroupDateAction() {
    const { updateSelectedField, tableType } = this.props;
    const needAction = field => field.currentType === 'date';
    const renderButton = (field, styles) => (
      <GroupingButton
        currentType={field.currentType}
        grouping={field.grouping}
        updateCurrentField={processField => updateSelectedField(processField(field))}
        iconStyle={styles.buttonIcon}
        buttonStyle={styles.button}
        tooltipStyles={styles.actionBtn.tooltip}
        iconMenuStyle={styles.iconMenu}
        allowNotGrouping={tableType === 'simple'}
      />
    );
    return { renderButton, needAction };
  }

  getAggFuncAction() {
    const renderButton = (field, styles) => {
      const changeAggFunc = newAggFunc => {
        const expression = field.expression.match(/^(?:COUNT|SUM|MIN|MAX|AVG)\((.+)\)$/)[1];
        const newAggExpression = `${newAggFunc}(${expression})`;
        if (newAggExpression !== field.expression) {
          field.expression = newAggExpression;
          this.props.updateSelectedField(field);
        }
      };
      return (
        <AggFuncIconMenu
          onItemTouchTap={changeAggFunc}
          iconMenuStyle={styles.iconMenu}
          iconStyle={styles.buttonIcon}
          buttonStyle={styles.button}
        />
      );
    };
    return { renderButton, needAction: () => true };
  }

  dropField(initData, label) {
    const { tableType, addFieldToQueryObj, extendFieldData,
      canAddFieldToModelPart, addFieldToModelPart } = this.props;
    if (tableType === 'pivot') {
      if (canAddFieldToModelPart({ fieldPath: initData.expression, label })) {
        const field = extendFieldData(initData, tableType, label);
        addFieldToQueryObj(field, tableType);
        addFieldToModelPart({ fieldId: field.id, modelPart: label });
      }
    } else addFieldToQueryObj(extendFieldData(initData, tableType, label));
  }

  dropFilterField(fieldData) {
    fieldData.constructorType = 'filters';
    this.props.addCollectionField(fieldData);
  }

  deleteFilterField(field) {
    field.constructorType = null;
    field.filters = null;
    this.props.updateCollectionField(field);
  }

  render() {
    const { tableType, viewObj, queryObj, getFilterFields, removeFieldFromModelPart,
      updateCollectionField, updateSelectedField } = this.props;
    const { pivot } = viewObj;
    const { fields, collectionFields } = queryObj;
    const { rows, columns, values } = pivot && pivot.model || {};
    const isPivot = tableType === 'pivot';
    const fieldsF = getFilterFields(collectionFields);
    const fieldsC = columns && fields.filter(f => !!~columns.indexOf(f.id)) || [];
    const fieldsR = rows && fields.filter(f => !!~rows.indexOf(f.id)) || [];
    const fieldsV = values && fields.filter(f => !!~values.indexOf(f.id)) || [];

    return (
      <div className="col-xs-12 col-sm-12 col-md-4 constructor-model">
        <div className="row">
          <ConstructorBlock
            label="filters"
            fields={fieldsF}
            handleDroppedField={this.dropFilterField}
            deleteField={this.deleteFilterField}
            filterFunc={updateCollectionField}
          />
          <ConstructorBlock
            label="columns"
            fields={isPivot ? fieldsC : fields}
            action={this.getGroupDateAction()}
            handleDroppedField={initData => this.dropField(initData, 'columns')}
            deleteField={removeFieldFromModelPart}
            filterFunc={updateSelectedField}
          />
        </div>
        {isPivot ?
          <div className="row">
            <ConstructorBlock
              label="rows"
              fields={fieldsR}
              action={this.getGroupDateAction()}
              handleDroppedField={initData => this.dropField(initData, 'rows')}
              deleteField={removeFieldFromModelPart}
              filterFunc={updateSelectedField}
            />
            <ConstructorBlock
              label="values"
              fields={fieldsV}
              action={this.getAggFuncAction()}
              deleteField={removeFieldFromModelPart}
              handleDroppedField={initData => this.dropField(initData, 'values')}
              filterFunc={updateSelectedField}
            />
          </div>
        : ''}
      </div>
    );
  }
}

Constructor.propTypes = {
  tableType: PropTypes.string,
  viewObj: PropTypes.object,
  queryObj: PropTypes.object,
  extendFieldData: PropTypes.func,
  addFieldToQueryObj: PropTypes.func,
  addCollectionField: PropTypes.func,
  getFilterFields: PropTypes.func,
  updateCollectionField: PropTypes.func,
  canAddFieldToModelPart: PropTypes.func,
  addFieldToModelPart: PropTypes.func,
  removeFieldFromModelPart: PropTypes.func,
  updateSelectedField: PropTypes.func,
};

export default Constructor;
