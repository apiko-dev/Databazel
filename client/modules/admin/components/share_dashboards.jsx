import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Dashboard from 'material-ui/svg-icons/action/dashboard';
import { grey400 } from 'material-ui/styles/colors';

class ShareDashboards extends React.Component {
  constructor(props) {
    super(props);
    const openMenu = false;
    this.state = { openMenu };
    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleOnRequestChange = this.handleOnRequestChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event, value) {
    const { userId, selectedDashboards, shareDashboards } = this.props;
    if (value[0] !== 'no_dashboard_yet') {
      shareDashboards({ userId, selectedDashboards, currentDashboards: value });
    }
  }
  handleOpenMenu() {
    this.setState({ openMenu: true });
  }
  handleOnRequestChange(value) {
    this.setState({ openMenu: value });
  }
  render() {
    const { dashboards, defaultDashboards } = this.props;
    return (
      <IconMenu
        iconButtonElement={
          <IconButton
            tooltip={i18n.__('share_dashboards')}
            tooltipPosition="top-center"
          >
            <Dashboard color={grey400} />
          </IconButton>}
        open={this.state.openMenu}
        onRequestChange={this.handleOnRequestChange}
        multiple
        onChange={this.handleChange}
        value={defaultDashboards}
      >
        {dashboards && dashboards.length ?
          dashboards.map(board =>
            <MenuItem key={board._id} value={board._id} primaryText={board.name} />
          ) :
          <MenuItem
            key="no_dashboard_yet"
            value="no_dashboard_yet"
            primaryText={i18n.__('no_dashboard_yet')}
          />
        }
      </IconMenu>
    );
  }
}

ShareDashboards.propTypes = {
  dashboards: PropTypes.array,
  selectedDashboards: PropTypes.array,
  defaultDashboards: PropTypes.array,
  userId: PropTypes.string,
  shareDashboards: PropTypes.func.isRequired,
};

export default ShareDashboards;
