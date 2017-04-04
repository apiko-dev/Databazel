import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import moment from 'moment';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import { cyan500 } from 'material-ui/styles/colors';
import { List, ListItem } from 'material-ui/List';

import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';
import UsersIcon from 'material-ui/svg-icons/action/supervisor-account';
import ChartIcon from 'material-ui/svg-icons/editor/show-chart';
// import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import StorageIcon from 'material-ui/svg-icons/device/storage';


const styles = {
  currentPath: {
    color: cyan500,
  },
  allChartsButton: {
    right: '-70px',
  },
  drawer: {
    overflowX: 'hidden',
  },
};

class Sidebar extends React.Component {
  constructor() {
    super();
    this.goTo = this.goTo.bind(this);
  }
  goTo({ to, params }) {
    const { handleSidebarState, routeTo } = this.props;
    handleSidebarState(false);
    routeTo(to, params);
  }
  render() {
    const { dashboards, charts, currentRouteName, currentParam, user, logout } = this.props;
    return (
      <div className="sidebar">
        <Drawer
          docked={false}
          width={300}
          open={this.props.open}
          onRequestChange={this.props.handleSidebarState}
          containerStyle={styles.drawer}
        >
          <h2 className="logo">Databazel</h2>
          {dashboards && dashboards.length ?
            <List>
              <Subheader> DASHBOARDS (most popular) </Subheader>
              {dashboards.map(dashboard =>
                <ListItem
                  key={dashboard._id}
                  primaryText={dashboard.name}
                  onTouchTap={
                    () => this.goTo({ to: 'dashboard', params: { dashboardId: dashboard._id } })
                  }
                  style={currentRouteName === 'dashboard' && currentParam === dashboard._id ?
                    styles.currentPath : {}
                  }
                />
              )}
            </List>
          : ''}
          <Divider />
          {charts && charts.length ?
            <List>
              <Subheader>
                CHARTS (modified)
                <FlatButton
                  onTouchTap={() => this.goTo({ to: 'charts' })}
                  label={i18n.__('all')}
                  style={styles.allChartsButton}
                />
              </Subheader>
              {charts.map(chart =>
                <ListItem
                  key={chart._id}
                  onTouchTap={
                    () => this.goTo({ to: 'chartEditor', params: { chartId: chart._id } })
                  }
                  style={currentRouteName === 'chartEditor' && currentParam === chart._id ?
                  styles.currentPath : {}
                }
                >
                  {chart.chartName}
                  <span className="chart-modified-ago">
                    ({moment(chart.modified).fromNow()})
                  </span>
                </ListItem>
              )}
            </List>
          : ''}
          <Divider />
          {user ?
            <List>
              <ListItem
                primaryText={i18n.__('create_chart')}
                onTouchTap={() => this.goTo({ to: 'workplace' })}
                rightIcon={<ChartIcon />}
                style={currentRouteName === 'workplace' ? styles.currentPath : {}}
              />
              {/* <ListItem
                primaryText={i18n.__('manage_dashboards')}
                onTouchTap={() => this.goTo({ to: 'home' })}
                rightIcon={<DashboardIcon />}
                style={currentRouteName === 'home' ? styles.currentPath : {}}
              />*/}
              {user.isAdmin ?
                <div>
                  <ListItem
                    primaryText={i18n.__('databases')}
                    onTouchTap={() => this.goTo({ to: 'databases' })}
                    rightIcon={<StorageIcon />}
                    style={currentRouteName === 'databases' ? styles.currentPath : {}}
                  />
                  <ListItem
                    primaryText={i18n.__('users')}
                    onTouchTap={() => this.goTo({ to: 'usersList' })}
                    rightIcon={<UsersIcon />}
                    style={currentRouteName === 'usersList' ? styles.currentPath : {}}
                  />
                </div>
              : ''}
              <ListItem
                primaryText={i18n.__('sing_out')}
                secondaryText={user.getEmail()}
                onTouchTap={logout}
                rightIcon={<ExitIcon />}
              />
            </List>
          : ''}
        </Drawer>
      </div>
    );
  }
}

Sidebar.propTypes = {
  currentRouteName: PropTypes.string,
  currentParam: PropTypes.string,
  dashboards: PropTypes.array,
  charts: PropTypes.array,
  open: PropTypes.bool,
  user: PropTypes.object,
  logout: PropTypes.func,
  routeTo: PropTypes.func,
  handleSidebarState: PropTypes.func,
};

export default Sidebar;
