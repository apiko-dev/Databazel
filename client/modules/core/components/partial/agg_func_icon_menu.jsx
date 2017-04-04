import React, { PropTypes } from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import i18n from 'meteor/universe:i18n';
import FunctionIcon from 'material-ui/svg-icons/editor/functions';

const AggFuncIconMenu = ({ onItemTouchTap, iconMenuStyle, buttonStyle, iconStyle }) => (
  <IconMenu
    onItemTouchTap={(foo, e) => onItemTouchTap(e.props.primaryText.slice(0, -2))}
    style={iconMenuStyle}
    iconButtonElement={
      <IconButton
        tooltip={i18n.__('aggregation_functions')}
        tooltipPosition="top-right"
        children={<FunctionIcon />}
        style={buttonStyle}
        iconStyle={iconStyle}
      />
    }
  >
    <MenuItem primaryText="COUNT()" />
    <MenuItem primaryText="SUM()" />
    <MenuItem primaryText="MIN()" />
    <MenuItem primaryText="MAX()" />
    <MenuItem primaryText="AVG()" />
  </IconMenu>
);

AggFuncIconMenu.propTypes = {
  onItemTouchTap: PropTypes.func,
  iconMenuStyle: PropTypes.object,
  iconStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
};

export default AggFuncIconMenu;
