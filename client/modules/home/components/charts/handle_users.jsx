import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import SocialPeople from 'material-ui/svg-icons/social/people';
import Dialog from 'material-ui/Dialog';
import { cyan500, grey800 } from 'material-ui/styles/colors';

class HandleUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openList: false,
      openDialog: false,
      userToUnshare: false,
      dashboardsAffected: false,
    };
    this.openList = this.openList.bind(this);
    this.handleChangeList = this.handleChangeList.bind(this);
    this.unshareChartAnyway = this.unshareChartAnyway.bind(this);
  }
  openList() {
    this.setState({ openList: true });
  }
  handleChangeList(e, value) {
    const { chartId, users,
      meteorMethodCall, handleUsersAddedToChart, getDashboardsForUserChart } = this.props;
    if (value[0] !== 'no_user_yet') {
      const { isSharing, userId } =
        handleUsersAddedToChart({ chartId, users, currentUsers: value });
      const dashboardsAffected = getDashboardsForUserChart({ userId, chartId });
      if (dashboardsAffected.length && !isSharing) {
        this.setState({ userToUnshare: userId, dashboardsAffected, openDialog: true });
      } else {
        meteorMethodCall('chart.handleSharingToUser', { userId, entityId: chartId, isSharing });
      }
    }
  }
  unshareChartAnyway() {
    const { chartId, meteorMethodCall } = this.props;
    const userId = this.state.userToUnshare;
    this.setState({ userToUnshare: false, dashboardsAffected: false, openDialog: false });
    meteorMethodCall('chart.handleSharingToUser', { userId, entityId: chartId, isSharing: false });
  }
  render() {
    const { users, chartId, style } = this.props;
    const values = users ?
      users.filter(user => (
        user.isShared({ entityType: 'chart', entityId: chartId })
      )).map(user => user._id)
      : [];
    const dialogActions = [
      <FlatButton
        label="Ok"
        primary
        keyboardFocused
        onTouchTap={this.unshareChartAnyway}
      />,
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={() => this.setState({ openDialog: false })}
      />,
    ];
    return (
      <div className="charts-handleUsers" >
        <Dialog
          title="You are going to unshare chart, which is added to the next dashboards:"
          actions={dialogActions}
          modal={false}
          open={this.state.openDialog}
          onRequestClose={this.handleCloseDialog}
        >
          <ul>
            {this.state.dashboardsAffected && this.state.dashboardsAffected
              .map(dashboard => (<li key={dashboard._id}>{dashboard.name}</li>))
            }
          </ul>
          If you continue, the user will not see the chart in the dashboards above. Continue?
        </Dialog>
        <IconMenu
          iconButtonElement={
            <IconButton
              onTouchTap={this.openList}
              tooltip={i18n.__('share')}
              tooltipPosition="bottom-center"
              children={<SocialPeople color={values.length ? cyan500 : grey800} />}
            />
          }
          open={this.state.openList}
          onRequestChange={value => this.setState({ openList: value })}
          multiple
          onChange={this.handleChangeList}
          value={values}
          style={style}
        >
          {users && users.length ?
            users.map(user =>
              <MenuItem key={user._id} value={user._id} primaryText={user.emails[0].address} />
            ) :
            <MenuItem
              key="no_user_yet"
              value="no_user_yet"
              primaryText={i18n.__('no_user_yet')}
            />
          }
        </IconMenu>
      </div>
    );
  }
}

HandleUsers.propTypes = {
  users: PropTypes.array,
  chartId: PropTypes.string,
  style: PropTypes.object,
  handleUsersAddedToChart: PropTypes.func.isRequired,
  meteorMethodCall: PropTypes.func.isRequired,
  getDashboardsForUserChart: PropTypes.func.isRequired,
};

export default HandleUsers;
