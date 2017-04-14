import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import ChartCanvas from '/client/modules/workplace/components/preview/chart_canvas';
import SimpleTable from '/client/modules/home/components/dashboards/simple_table.jsx';
import PivotTable from '/client/modules/workplace/containers/preview/pivot_table.js';

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

const Chart = props => {
  const { chart } = props;
  if (!chart) {
    return (
      <p style={{ textAlign: 'center', margin: '30px 20px' }}>
        {i18n.__('no_charts_shared')}
      </p>
    );
  }
  const { viewObject: { data, chartType, dataTimeStamp, pivot }, queryObject } = chart;
  const needRedraw = !dataTimeStamp || Date.now() - dataTimeStamp < 1000;
  if (chartType) {
    return (
      <ChartCanvas
        data={data}
        fields={queryObject.fields}
        chartType={chartType}
        maxHeight
        heightIsFixed
        needRedraw={needRedraw}
      />
    );
  }
  return (
    !!pivot
      ? <PivotTable chart={Object.assign(chart, { data })} />
      : <SimpleTable chart={chart} />
  );
};

Chart.propTypes = {
  chart: PropTypes.object,
};

export default Chart;
