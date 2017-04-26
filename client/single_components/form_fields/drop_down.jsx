import React, { PropTypes } from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import { _ } from 'meteor/underscore';
import LikeFilterInfoBtn from './like_filter_info_btn';

const style = {
  innerDivStyle: {
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  flatBtn: {
    width: '60px',
    minWidth: '60px',
    height: 'auto',
    lineHeight: '10px',
  },
  flatBtnLabel: {
    paddingLeft: 0,
    paddingRight: 0,
  },
};

class DropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || props.items[0].value,
      isMenuOpen: false,
    };
    this.handelChange = this.handelChange.bind(this);
    this.getCurrentLabel = this.getCurrentLabel.bind(this);
    this.openMenu = this.openMenu.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value === this.props.value) return;
    this.setState({ value: nextProps.value });
  }

  getIconStyle() {
    const { dropDownStyle: { icon } } = this.props;
    let style = icon;
    if (this.props.isMenuDisabled) {
      style = _.clone(icon);
      style.color = '#c3c3c3';
    }
    return style || {};
  }

  getCurrentLabel() {
    const value = this.state.value === '<> null' ? '<>' : this.state.value;
    return _.find(this.props.items, item => item.value === value).label;
  }

  handelChange(e, value) {
    this.setState({ value });
    this.props.onChange(e, null, value);
  }

  openMenu() {
    this.setState({ isMenuOpen: !this.props.isMenuDisabled });
  }

  render() {
    const { items, dropDownStyle, tooltip } = this.props;
    const { isMenuOpen, value: selectedValue } = this.state;
    const { flatBtn, flatBtnLabel, innerDivStyle } = style;

    return (
      <div className="drop-down">
        <IconMenu
          onChange={this.handelChange}
          value={selectedValue}
          open={isMenuOpen}
          iconStyle={this.getIconStyle()}
          onTouchTap={this.openMenu}
          onRequestChange={value => this.setState({ isMenuOpen: value })}
          iconButtonElement={
            <IconButton
              tooltip={tooltip ? `${tooltip}: ${selectedValue}` : ''}
              tooltipPosition="top-center"
              style={dropDownStyle.iconBtn}
              iconClassName={'info'}
            >
              {this.getCurrentLabel()}

            </IconButton>
          }
        >
          {items.map((item, i) => (
            item.visible ?
              <MenuItem
                key={i}
                value={item.value}
                disabled={item.disabled}
                primaryText={item.label}
                innerDivStyle={innerDivStyle}
              />
            : ''
          ))}
        </IconMenu>
        {typeof this.getCurrentLabel() === 'string' ?
          <FlatButton
            label={this.getCurrentLabel()}
            hoverColor="#fff"
            onTouchTap={() => this.setState({ isMenuOpen: true })}
            style={flatBtn}
            labelStyle={flatBtnLabel}
          />
        : ''}
        {selectedValue === 'LIKE' ? <LikeFilterInfoBtn /> : ''}
      </div>
    );
  }
}

DropDown.propTypes = {
  value: PropTypes.string,
  isMenuDisabled: PropTypes.bool,
  items: PropTypes.array,
  dropDownStyle: PropTypes.object,
  onChange: PropTypes.func,
  tooltip: PropTypes.string,
};

export default DropDown;
