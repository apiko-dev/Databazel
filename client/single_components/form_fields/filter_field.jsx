import React, { PropTypes } from 'react';
import Formsy from 'formsy-react';
import TextField from 'material-ui/TextField';
import DropDown from '/client/single_components/form_fields/drop_down.jsx';
import Close from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import { stringOperatorsOptions, numberOperatorsOptions } from '/lib/constants';
import { _ } from 'meteor/underscore';

const style = {
  labelStyle: {
    fontSize: '10px',
  },
  flatButton: {
    lineHeight: 'auto',
    minWidth: 'auto',
    height: 'auto',
    backgroundColor: '#fff',
  },
  divider: {
    position: 'relative',
    top: '12px',
    height: '3px',
  },
  close: {
    width: '15px',
    height: '15px',
    cursor: 'pointer',
  },
  dropDown: {
    iconBtn: {
      display: 'none',
    },
  },
  textField: {
    width: 'auto',
  },
};

const StringFilter = React.createClass({
  propTypes: {
    field: PropTypes.string,
    value: PropTypes.string,
    operator: PropTypes.string,
    joinOperator: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    updateFiltersState: React.PropTypes.func,
  },
  mixins: [Formsy.Mixin],
  getInitialState() {
    return { isNullSetted: false };
  },
  componentWillMount() {
    const { value, operator, joinOperator } = this.props;
    if (value || operator || joinOperator) {
      this.setValue({
        value,
        joinOperator,
        operator: operator || stringOperatorsOptions[0].value,
      });
    }
    if (operator === '<> null') this.setState({ isNullSetted: true });
  },
  getOptions(type) {
    const assignVisibleTrue = foo => _.extend(_.clone(foo), { visible: true });
    if (type === 'string') return stringOperatorsOptions.map(assignVisibleTrue);
    if (type === 'number') return numberOperatorsOptions.map(assignVisibleTrue);
    return null;
  },
  changeValue(e) {
    const valueObj = this.getValue() || { operator: stringOperatorsOptions[0].value };
    valueObj.value = e.currentTarget.value;
    this.setValue(valueObj);
  },
  changeSign(e, index, value) {
    const valueObj = this.getValue() || {};
    valueObj.operator = value;
    this.setState({ isNullSetted: value === '<> null' });
    if (value === '<> null') this.setState({ value: '' });
    this.setValue(valueObj);
  },
  changeJoinOperator(e) {
    const valueObj = this.getValue();
    const textBtnElem = e.currentTarget.firstElementChild.lastElementChild;
    const newOperator = textBtnElem.textContent === 'AND' ? 'OR' : 'AND';
    textBtnElem.textContent = newOperator;
    valueObj.joinOperator = newOperator;
    this.setValue(valueObj);
  },
  extendFilter(e) {
    const { valueField, signField } = this.refs;
    const operator = stringOperatorsOptions[0].value;
    const valueObj = this.getValue() || { operator };
    const index = this.props.name.slice(6);
    valueObj.joinOperator = e.currentTarget.textContent;

    if (this.props.name === 'filterCurrent') {
      valueField.input.value = '';
      signField.setState({ value: operator });
      this.resetValue();
      this.props.updateFiltersState((currentFilters) => {
        currentFilters.push(valueObj);
        return currentFilters;
      });
    } else {
      this.props.updateFiltersState((currentFilters) => {
        currentFilters.splice(+index, 1, valueObj);
        return currentFilters;
      });
    }
  },
  removeFilter() {
    const index = this.props.name.slice(6);
    this.props.updateFiltersState((currentFilters) => {
      currentFilters.splice(+index, 1);
      return currentFilters;
    });
  },
  renderJoinButton(label, handler) {
    return (
      <FlatButton
        style={style.flatButton}
        labelStyle={style.labelStyle}
        onTouchTap={handler}
        label={label}
      />
    );
  },
  render() {
    const { value, operator, joinOperator, name, type } = this.props;
    return (
      <div className="string-filter">
        <div className="filter-field">{this.props.field}</div>
        <DropDown
          items={this.getOptions(type)}
          value={operator}
          ref="signField"
          onChange={this.changeSign}
          dropDownStyle={style.dropDown}
        />
        <TextField
          name="valueField"
          type={type}
          ref="valueField"
          disabled={this.state.isNullSetted}
          hintText={this.state.isNullSetted ? ' null ' : ''}
          value={this.state.value}
          defaultValue={value}
          onChange={this.changeValue}
          style={style.textField}
        />
        {name !== 'filterCurrent' ?
          <span onTouchTap={this.removeFilter}>
            <Close style={style.close} />
          </span>
        : ''}
        <div className="extend-filter">
          <Divider style={style.divider} />
          {joinOperator ?
            this.renderJoinButton(joinOperator, this.changeJoinOperator)
            :
            <span>
              {this.renderJoinButton('AND', this.extendFilter)}
              {this.renderJoinButton('OR', this.extendFilter)}
            </span>
          }
        </div>
      </div>
    );
  },
});

export default StringFilter;
