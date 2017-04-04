import React from 'react';
import { _ } from 'meteor/underscore';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import SaveChartForm from '../../components/preview/save_chart_form.jsx';
import { pivotCellsLimit } from '/lib/constants';

export const composer = ({ context, chartId, getSelectDashboardsOptions },
    onData) => {
  const { Meteor, Collections, FlowRouter, LocalState } = context();
  const props = {};
  const isDashboardsReady = Meteor.subscribe('dashboards').ready();
  const dashboards = isDashboardsReady ? Collections.Dashboards.find({}).fetch() : [];
  props.dashboards = getSelectDashboardsOptions(dashboards);

  if (chartId) {
    const isChartsReady = Meteor.subscribe('charts', chartId).ready();
    if (isChartsReady && isDashboardsReady) {
      const savedChart = Collections.Charts.findOne({ _id: chartId });
      const currentChart = {
        queryObject: LocalState.get('SQL_QUERY_OBJECT'),
        viewObject: LocalState.get('VIEW_OBJECT'),
      };
      const { data, pivot } = currentChart.viewObject;
      props.chart = savedChart;
      props.selectedDashboards = savedChart.inclusiveDashboardsIds();
      props.chart.isOverload = pivot && data && data.length === pivotCellsLimit;
      props.chart.isModified =
        !_.isEqual(savedChart.queryObject, currentChart.queryObject) ||
        !_.isEqual(
          _.omit(savedChart.viewObject, 'data'), _.omit(currentChart.viewObject, 'data')
        );
    }
  } else {
    const currentDashboardId = FlowRouter.getParam('dashboardId');
    props.chart = { isModified: true };
    props.selectedDashboards = currentDashboardId ? [currentDashboardId] : [];
  }
  onData(null, props);
};

export const depsMapper = (context, actions) => ({
  saveChart: actions.charts.saveChart,
  meteorMethodCall: actions.core.meteorMethodCall,
  getSelectDashboardsOptions: actions.charts.getSelectDashboardsOptions,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer, () => <i></i>),
  useDeps(depsMapper)
)(SaveChartForm);
