import React, { PropTypes } from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import i18n from 'meteor/universe:i18n';
import { cyan500 } from 'material-ui/styles/colors';
import { _ } from 'meteor/underscore';
import GroupWork from 'material-ui/svg-icons/action/group-work';

const style = {
  active: {
    color: cyan500,
  },
  iconBtn: {
    zIndex: 1101,
  },
};

class GroupingButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { groupValue: false };
    this.iconButton = this.iconButton.bind(this);
    this.groupByDataPart = this.groupByDataPart.bind(this);
    this.group = this.group.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ groupValue: nextProps.grouping });
  }
  iconButton(updateGrouping) {
    const { grouping, buttonStyle = {}, iconStyle = {}, tooltipStyles } = this.props;

    return (
      <IconButton
        style={_.extend(_.clone(style.iconBtn), buttonStyle)}
        tooltip={i18n.__('group_by_field')}
        tooltipPosition={'top-center'}
        tooltipStyles={tooltipStyles}
        onTouchTap={updateGrouping}
        iconStyle={_.extend(grouping ? _.clone(style.active) : {}, iconStyle)}
        children={<GroupWork />}
      />
    );
  }
  groupByDataPart(e, value) {
    this.props.updateCurrentField((currentField) => {
      currentField.grouping = value;
      currentField.isTypeChanged = value;
      return currentField;
    });
  }
  group() {
    this.props.updateCurrentField((currentField) => {
      currentField.grouping = !currentField.grouping;
      return currentField;
    });
  }
  render() {
    const { currentType, iconMenuStyle, allowNotGrouping } = this.props;
    if (currentType === 'date') {
      return (
        <IconMenu
          iconButtonElement={this.iconButton()}
          onChange={this.groupByDataPart}
          value={this.state.groupValue}
          style={iconMenuStyle}
        >
          {allowNotGrouping && <MenuItem value={false} primaryText="Not grouping" />}
          <MenuItem value="minute" primaryText="Minute" />
          <MenuItem value="hour" primaryText="Hour" />
          <MenuItem value="day" primaryText="Day" />
          <MenuItem value="week" primaryText="Week" />
          <MenuItem value="month" primaryText="Month" />
          <MenuItem value="year" primaryText="Year" />
          <MenuItem value="doy" primaryText="Day of year" />
          <MenuItem value="dow" primaryText="Day of week" />
        </IconMenu>
      );
    }
    return this.iconButton(this.group);
  }
}

GroupingButton.propTypes = {
  updateCurrentField: PropTypes.func,
  currentType: PropTypes.string,
  iconMenuStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
  tooltipStyles: PropTypes.object,
  iconStyle: PropTypes.object,
  allowNotGrouping: PropTypes.bool,
};

export default GroupingButton;
