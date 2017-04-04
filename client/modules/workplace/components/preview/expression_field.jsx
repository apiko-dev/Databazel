import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import TextInput from '/client/single_components/form_fields/text_input.jsx';
import i18n from 'meteor/universe:i18n';

const style = {
  container: {
    width: '100%',
  },
  iconBtn: {
    zIndex: 1101,
  },
  textInput: {
    top: '-10px',
  },
};

class ExpressionField extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value };
    this.selectFunc = this.selectFunc.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value === this.props.value) return;
    this.setState({ value: nextProps.value });
  }
  selectFunc(e) {
    const funcName = e.currentTarget.textContent.slice(0, -2);
    const value = this.state.value;
    let newValue;

    if (value.indexOf('(') === -1) {
      newValue = `${funcName}(${value})`;
      ReactDOM.findDOMNode(this.refs.field).getElementsByTagName('input')[0].focus();
    } else {
      newValue = `${value} ${funcName}()`;
    }
    this.setState({ value: newValue });
  }
  render() {
    return (
      <div style={style.container}>
        <IconMenu
          onItemTouchTap={this.selectFunc}
          iconButtonElement={
            <IconButton
              iconClassName="material-icons"
              tooltip={i18n.__('aggregation_functions')}
              tooltipPosition="top-center"
              style={style.iconBtn}
            >
              functions
            </IconButton>
          }
        >
          <MenuItem primaryText="COUNT()" />
          <MenuItem primaryText="SUM()" />
          <MenuItem primaryText="MIN()" />
          <MenuItem primaryText="MAX()" />
          <MenuItem primaryText="AVG()" />
        </IconMenu>
        <div className="expression-container backlight">
          <TextInput
            style={style.textInput}
            hintText="Expression"
            ref="field"
            value={this.state.value}
            onBlur={this.props.onChange}
            fullWidth
          />
        </div>
      </div>
    );
  }
}

ExpressionField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default ExpressionField;
