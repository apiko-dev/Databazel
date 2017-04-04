import React, { PropTypes } from 'react';
import SingleImageRender from './single_image_renderer';

const styles = {
  position: 'absolute',
  top: '-10000px',
};

class ImageRender extends React.Component {
  componentDidMount() {
    this.props.handleRenderFinished();
    return false;
  }
  render() {
    const { chartsData, exportChartBase64 } = this.props;
    if (chartsData) {
      return (
        <div style={styles}>
          {chartsData.map((chart, i) => (
            <SingleImageRender
              key={`${chart.chartType}_${i}`} {...chart}
              exportChartBase64={exportChartBase64}
            />
          ))}
        </div>
      );
    }
    return null;
  }
}

ImageRender.propTypes = {
  chartsData: PropTypes.array,
  handleRenderFinished: PropTypes.func,
  exportChartBase64: PropTypes.func,
  dashboardName: PropTypes.string,
};

export default ImageRender;
