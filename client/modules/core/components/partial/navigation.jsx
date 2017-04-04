import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import currentDashboard from '/client/modules/home/containers/dashboards/current_dashboard';
import DatabasesDropDown from '../../containers/database_drop_down';
import Sidebar from '../../containers/sidebar';
import HelpdeskButton from './helpdesk_button';
import DocumentsButton from './documents_button';
import TextField from 'material-ui/TextField';
import { cyan500, white } from 'material-ui/styles/colors';

const styles = {
  title: {
    cursor: 'pointer',
    flex: '',
  },
  root: {
    fontSize: '0.8em',
    width: 190,
  },
  input: {
    color: white,
    fontSize: '1.5em',
  },
  underlineStyle: {
    borderColor: cyan500,
  },
  underlineFocusStyle: {
    borderColor: white,
  },
  selectField: {
    width: 'auto',
  },
};

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSidebarState = this.handleSidebarState.bind(this);
    this.renameDashboard = this.renameDashboard.bind(this);
  }
  handleToggle() {
    this.setState({ open: !this.state.open });
  }
  handleSidebarState(open) {
    this.setState({ open });
  }
  renameDashboard(e) {
    this.props.meteorMethodCall('dashboard.rename', {
      dashboardId: this.props.dashboard._id,
      newName: e.currentTarget.value,
    });
  }
  render() {
    const { routeTo, dashboard, currentRoute } = this.props;
    return (
      <div>
        <AppBar
          title="Databazel"
          titleStyle={styles.title}
          onLeftIconButtonTouchTap={this.handleToggle}
          onTitleTouchTap={() => routeTo('home')}
        >
          <div className="app-bar-content">
            <div className="left-content">
              {dashboard && dashboard.name ?
                <TextField
                  name="chartName"
                  defaultValue={dashboard.name}
                  onBlur={this.renameDashboard}
                  style={styles.root}
                  inputStyle={styles.input}
                  underlineStyle={styles.underlineStyle}
                  underlineFocusStyle={styles.underlineFocusStyle}
                />
              : ''}
              {currentRoute === 'workplace' || currentRoute === 'chartEditor' ?
                <DatabasesDropDown />
              : ''}
            </div>

            <div className="right-content">
              <span className="hidden-xs">
                <DocumentsButton />
                <HelpdeskButton />
              </span>
            </div>
          </div>
        </AppBar>
        <Sidebar
          open={this.state.open}
          handleSidebarState={this.handleSidebarState}
        />
      </div>
    );
  }
}

Nav.propTypes = {
  currentRoute: PropTypes.string,
  dashboard: PropTypes.object,
  meteorMethodCall: PropTypes.func,
  routeTo: PropTypes.func,
};

const Navigation = currentDashboard(Nav);

export default Navigation;
