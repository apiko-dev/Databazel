import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import IconButton from 'material-ui/IconButton';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';

const style = {
  zIndex: 1200,
  position: 'absolute',
  top: '45%',
};

const NavButton = ({ onClick, right }) => (
  <IconButton
    onTouchTap={onClick}
    children={right ? <ChevronRight color={'white'} /> : <ChevronLeft color={'white'} />}
    style={_.extend(_.clone(style), { [right ? 'right' : 'left']: -55 })}
  />
);

NavButton.propTypes = {
  right: PropTypes.bool,
  onClick: PropTypes.func,
};

export default NavButton;
