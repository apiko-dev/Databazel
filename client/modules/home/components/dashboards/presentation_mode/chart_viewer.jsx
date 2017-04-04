import React, { PropTypes } from 'react';
import Slider from 'react-slick';
import '/node_modules/slick-carousel/slick/slick.css';
import '/node_modules/slick-carousel/slick/slick-theme.css';
import DataVisualisation from '../data_visualisation';
import NavButton from './nav_button.jsx';

const ChartViewer = ({ dashboard, charts, meteorMethodCall, routeTo, setChartViewerState }) => {
  if (!charts) return null;
  const settings = {
    className: 'slider-item',
    adaptiveHeight: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <NavButton />,
    nextArrow: <NavButton right />,
  };
  return (
    <div
      className="chart-viewer anchor-for-click"
      onClick={e => /anchor-for-click/.test(e.target.className) && setChartViewerState(false)}
    >
      <div>
        <Slider {...settings}>
          {charts.map(chart => (
            <div key={chart._id}>
              <DataVisualisation
                chart={chart}
                dashboardId={dashboard._id}
                meteorMethodCall={meteorMethodCall}
                routeTo={routeTo}
                maxHeight={140}
                heightIsFixed
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

ChartViewer.propTypes = {
  dashboard: PropTypes.object,
  charts: PropTypes.object,
  meteorMethodCall: PropTypes.func.isRequired,
  routeTo: PropTypes.func.isRequired,
  setChartViewerState: PropTypes.func.isRequired,
};

export default ChartViewer;
