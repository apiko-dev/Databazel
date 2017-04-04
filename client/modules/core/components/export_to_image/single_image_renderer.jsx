import React, { PropTypes } from 'react';
import getChart from '/client/single_components/get_chart';

import { chartSize } from '/lib/constants';

class SingleImageRenderer extends React.Component {

  componentDidMount() {
    this.exportImageData();
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.chartId !== this.props.chartId;
  }

  exportImageData() {
    const { chartType, chartId, exportChartBase64, chartName } = this.props;
    if (chartType) {
      const chartComponent = this.refs.ImageRenderer;
      const renderedChart = chartComponent.getChart().render(0, true);
      const ctx = renderedChart.chart.ctx;
      const canvas = chartComponent.getCanvas();
      const filledImage = this.fillBackground(ctx, canvas, 'white');
      const image = filledImage.substr(filledImage.indexOf(',') + 1);
      exportChartBase64({
        chartId,
        image,
        chartName,
        chartType,
      });
    }
  }

  fillBackground(context, canvas, backgroundColor) {
    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  }
  render() {
    const { chartData, options, chartType } = this.props;
    if (chartType) {
      const Chart = getChart(chartType);
      return (
        <Chart
          ref="ImageRenderer"
          data={chartData}
          width={chartSize.width}
          height={chartSize.height}
          options={Object.assign(options, {
            responsive: false,
            events: [],
          })}
        />
      );
    }
    return null;
  }
}

SingleImageRenderer.propTypes = {
  options: PropTypes.object,
  chartData: PropTypes.object,
  chartType: PropTypes.string,
  exportChartBase64: PropTypes.func,
  chartId: PropTypes.string,
  chartName: PropTypes.string,
};

export default SingleImageRenderer;
