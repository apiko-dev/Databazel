import React, { PropTypes } from 'react';
import dataProcessing from '/lib/data_processing.js';
import getChart from '/client/single_components/get_chart';
import { _ } from 'meteor/underscore';

class ChartCanvas extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { data, chartType, fields } = this.props;
    const isDataChanged = !_.isEqual(data, nextProps.data);
    const isChartTypeChanged = chartType !== nextProps.chartType;
    const isFieldsChanged = !isEqualArrays(
      fields.map(f => f.constructorType),
      nextProps.fields.map(f => f.constructorType)
    );

    function isEqualArrays(arr1, arr2) {
      for (let i = 0; i < (arr1.length || arr2.length); i++) {
        if (arr1[i] !== arr2[i]) return false;
      }
      return true;
    }
    return isChartTypeChanged || isDataChanged || isFieldsChanged;
  }

  render() {
    const { data, fields, chartType, heightIsFixed, tableType, needRedraw, maxHeight } = this.props;
    const chartData = dataProcessing.chart(data, fields, chartType, tableType);
    const Chart = getChart(chartType);
    let height;
    if (heightIsFixed) {
      height = { minHeight: `${window.innerHeight - (maxHeight || 270)}px` };
    } else {
      height = { height: '100%' };
    }
    return (
      <div
        style={height}
        className="chart-canvas"
      >
        <Chart
          data={chartData.data}
          redraw={needRedraw}
          options={_.extend(chartData.options, {
            responsive: true,
            maintainAspectRatio: false,
          })}
        />
      </div>
    );
  }
}

ChartCanvas.propTypes = {
  data: PropTypes.array,
  fields: PropTypes.array,
  chartType: PropTypes.string.isRequired,
  tableType: PropTypes.string,
  heightIsFixed: PropTypes.bool.isRequired,
  needRedraw: PropTypes.bool.isRequired,
  maxHeight: PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.bool]),
};

export default ChartCanvas;
