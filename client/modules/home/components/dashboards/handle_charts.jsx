import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Divider from 'material-ui/Divider';

const styles = {
  root: {
    notEmpty: {
      position: 'fixed',
      right: '30px',
      bottom: '30px',
    },
    empty: {
      position: 'fixed',
      left: '50%',
      marginLeft: '-28px',
      top: '50%',
      marginTop: '-28px',
    },
  },
  tip: {
    marginLeft: '-85px',
    marginTop: '15px',
    color: 'grey',
  },
};

class HandleCharts extends React.Component {
  constructor() {
    super();
    this.state = { valueMultiple: [] };
    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleOnRequestChange = this.handleOnRequestChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e, value) {
    const { dashboardId } = this.props;
    if (value === 'create_new') {
      this.props.routeTo('workplace', { dashboardId });
    } else {
      this.props.meteorMethodCall('dashboard.addChartToDashboard', {
        dashboardId,
        chartId: value,
      });
    }
  }
  handleOpenMenu() {
    this.setState({ openMenu: true });
  }
  handleOnRequestChange(value) {
    this.setState({ openMenu: value });
  }
  render() {
    const { isDashboardEmpty, chartsToAdd } = this.props;
    return (
      <div style={styles.root[isDashboardEmpty ? 'empty' : 'notEmpty']}>

        <IconMenu
          iconButtonElement={<IconButton style={{ display: 'none' }} />}
          open={this.state.openMenu}
          onRequestChange={this.handleOnRequestChange}
          onChange={this.handleChange}
        >
          {chartsToAdd.map(chart => (
            <MenuItem key={chart._id} value={chart._id} primaryText={chart.chartName} />
          ))}
          {chartsToAdd.count() ? <Divider /> : ''}

          <MenuItem
            key="create_new"
            value="create_new"
            primaryText={i18n.__('create_new')}
            style={{ fontWeight: 500 }}
          />
        </IconMenu>

        <FloatingActionButton onTouchTap={this.handleOpenMenu}>
          <ContentAdd />
        </FloatingActionButton>

        {isDashboardEmpty ?
          <div style={styles.tip}>
            {i18n.__('add_first_chart_to_this_dashboard')}
          </div>
        : ''}
      </div>
    );
  }
}

HandleCharts.propTypes = {
  chartsToAdd: PropTypes.object,
  dashboardId: PropTypes.string,
  isDashboardEmpty: PropTypes.bool,
  meteorMethodCall: PropTypes.func.isRequired,
  routeTo: PropTypes.func,
};

export default HandleCharts;
