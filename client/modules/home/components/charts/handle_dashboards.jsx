import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import ActionDashboard from 'material-ui/svg-icons/action/dashboard';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import MenuItem from 'material-ui/MenuItem';
import { _ } from 'meteor/underscore';
import { grey400 } from 'material-ui/styles/colors';


class PreviewHandleDashboards extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(board) {
    const { meteorMethodCall, chartId } = this.props;
    meteorMethodCall(
      board.added ? 'dashboard.removeChartFromDashboard' : 'dashboard.addChartToDashboard',
      { chartId, dashboardId: board._id }
    );
  }
  render() {
    const { parsedDashboards: boards, isNoDashboardsAdded } = this.props;
    return (
      <MenuItem
        primaryText={i18n.__('dashboards')}
        leftIcon={<ActionDashboard color={grey400} />}
        rightIcon={<ArrowDropRight />}
        menuItems={boards && boards.length ?
          boards.map(board =>
            <MenuItem
              key={board._id}
              primaryText={board.name}
              checked={board.added}
              insetChildren={!isNoDashboardsAdded && !board.added}
              onTouchTap={() => this.handleChange(board)}
            />
          ) :
          [<MenuItem
            key="no_dashboard_yet"
            primaryText={i18n.__('no_dashboard_yet')}
            disabled
          />]
        }
      />
    );
  }
}

PreviewHandleDashboards.propTypes = {
  parsedDashboards: PropTypes.array,
  chartId: PropTypes.string,
  isNoDashboardsAdded: PropTypes.bool,
  meteorMethodCall: PropTypes.func.isRequired,
};

export default PreviewHandleDashboards;
