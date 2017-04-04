import React, { PropTypes } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ZoomOutMap from 'material-ui/svg-icons/maps/zoom-out-map';
import DataVisualisation from '../../containers/dashboards/data_visualisation';
import HandleCharts from '../../containers/dashboards/handle_charts';
import ChartViewer from '../../containers/dashboards/chart_viewer';
import { _ } from 'meteor/underscore';
import { Responsive, WidthProvider } from 'react-grid-layout';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import { defaultBreakpointsCols, defaultBreakpoints, gridSystemRowHeight } from '/lib/constants';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const styles = {
  chartViewerButton: {
    position: 'fixed',
    right: '30px',
    bottom: '100px',
  },
};


class Dashboard extends React.Component {
  constructor() {
    super();
    this.saveLayouts = this.saveLayouts.bind(this);
    this.setChartViewerState = this.setChartViewerState.bind(this);
    this.state = { chartViewerOpen: false };
  }
  componentWillUnmount() {
    this.props.meteorMethodCall('dashboard.incViewsCounter',
      { dashboardId: this.props.dashboard._id }
    );
  }
  getChartsLocation() {
    const { dashboard, chartsLocations, parseChartsLocations } = this.props;

    const chartsWOLocations = _.difference(
      dashboard.chartsId,
      chartsLocations.map(loc => loc.chartId)
    );
    return parseChartsLocations({
      chartsLocations: chartsLocations.fetch(),
      chartsWOLocations,
    });
  }
  setChartViewerState(chartViewerOpen) {
    this.setState({ chartViewerOpen });
  }
  saveLayouts(loc, newLayouts) {
    const dashboardId = this.props.dashboard._id;
    const oldLayouts = this.getChartsLocation();
    this.props.saveLayouts({
      dashboardId,
      newLayouts,
      oldLayouts,
    });
  }
  render() {
    const chartsLocation = this.getChartsLocation();
    const { dashboard } = this.props;
    const { _id, chartsId = [] } = dashboard;
    return (
      <div>
        {chartsId.length ?
          <div>
            <ResponsiveReactGridLayout
              className="layout dashboard"
              layouts={chartsLocation}
              onLayoutChange={this.saveLayouts}
              breakpoints={defaultBreakpoints}
              cols={defaultBreakpointsCols}
              rowHeight={gridSystemRowHeight}
              margin={[12, 12]}
              containerPadding={[0, 0]}
            >
              {chartsId.map((chartId) => (
                <div key={chartId}>
                  <DataVisualisation
                    chartId={chartId}
                    dashboardId={_id}
                  />
                </div>
              ))}
            </ResponsiveReactGridLayout>
            {this.state.chartViewerOpen &&
              <ChartViewer dashboard={dashboard} setChartViewerState={this.setChartViewerState} />}
          </div>
        : ''}

        <HandleCharts dashboard={dashboard} />
        <FloatingActionButton
          style={styles.chartViewerButton}
          onTouchTap={() => this.setChartViewerState(true)}
          children={<ZoomOutMap />}
        />
      </div>

    );
  }
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
  chartsLocations: PropTypes.object,
  meteorMethodCall: PropTypes.func.isRequired,
  saveLayouts: PropTypes.func.isRequired,
  parseChartsLocations: PropTypes.func.isRequired,
};

export default Dashboard;
