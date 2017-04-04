import React, { PropTypes } from 'react';
import Formsy from 'formsy-react';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';

const MultiSelect = React.createClass({
  propTypes: {
    options: PropTypes.array,
    value: PropTypes.array,
    label: PropTypes.string,
    style: PropTypes.object,
  },
  mixins: [Formsy.Mixin],
  getInitialState() {
    return { openMenu: false };
  },
  handleChange(event, value) {
    this.setValue(value);
  },
  handleOpenMenu() {
    this.setState({ openMenu: true });
  },
  handleOnRequestChange(value) {
    this.setState({ openMenu: value });
  },

  render() {
    const { options, label, style } = this.props;
    return (
      <div>
        <IconMenu
          iconButtonElement={<IconButton style={{ display: 'none' }} />}
          open={this.state.openMenu}
          onRequestChange={this.handleOnRequestChange}
          multiple
          onChange={this.handleChange}
          value={this.getValue()}
          menuStyle={style.menu}
        >
          {options.map(option =>
            <MenuItem
              key={option.value}
              value={option.value}
              primaryText={option.text}
            />
          )}
        </IconMenu>
        <FlatButton
          onTouchTap={this.handleOpenMenu}
          label={label}
          style={style.button}
          backgroundColor={style.button.backgroundColor}
          hoverColor={style.button.hoverColor}
        />
      </div>
    );
  },
});

export default MultiSelect;
