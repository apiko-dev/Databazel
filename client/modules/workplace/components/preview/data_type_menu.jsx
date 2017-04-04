import React, { PropTypes } from 'react';
import NumberTypeIcon from '/client/single_components/chart_icons/NumberTypeIcon.jsx';
import BooleanTypeIcon from '/client/single_components/chart_icons/BooleanTypeIcon.jsx';
import DropDown from '/client/single_components/form_fields/drop_down.jsx';
import SvgIcon from 'material-ui/SvgIcon';
import FontIcon from 'material-ui/FontIcon';
import { _ } from 'meteor/underscore';

class DataTypeMenu extends React.Component {
  constructor(props) {
    super(props);
    this.style = {
      common: {
        width: 24,
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        color: 'rgb(66, 66, 66)',
        fill: 'currentcolor',
      },
      additional: {
        position: 'relative',
        top: 3,
      },
    };
  }

  render() {
    const { value, onChange, dropDownStyle, tooltip, allowedTypes = [] } = this.props;
    const additionalStyle = _.extend(_.clone(this.style.common), this.style.additional);
    let typeOptions = [
      {
        value: 'string',
        label:
          <FontIcon className="material-icons" style={this.style.common}>
            text_format
          </FontIcon>,
      },
      {
        value: 'number',
        label: <SvgIcon style={additionalStyle}><NumberTypeIcon /></SvgIcon>,
      },
      {
        value: 'date',
        label: <FontIcon className="material-icons" style={this.style.common}>date_range</FontIcon>,
      },
      {
        value: 'boolean',
        label: <SvgIcon style={additionalStyle}><BooleanTypeIcon /></SvgIcon>,
      },
    ];

    typeOptions = typeOptions.map(option => {
      option.visible = !!~allowedTypes.indexOf(option.value);
      return option;
    });

    return (
      <DropDown
        value={value}
        items={typeOptions}
        isMenuDisabled={allowedTypes.length < 2}
        onChange={onChange}
        dropDownStyle={dropDownStyle}
        tooltip={tooltip}
      />
    );
  }
}

DataTypeMenu.propTypes = {
  value: PropTypes.string,
  tooltip: PropTypes.string,
  allowedTypes: PropTypes.array,
  onChange: PropTypes.func,
  dropDownStyle: PropTypes.object,
};

export default DataTypeMenu;
