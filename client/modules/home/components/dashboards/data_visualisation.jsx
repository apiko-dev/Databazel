import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import { Card } from 'material-ui/Card';
import ChartCanvas from '../../../workplace/components/preview/chart_canvas.jsx';
import ChartHeader from './chart_header.jsx';
import ChartFooter from './chart_footer.jsx';
import SimpleTable from './simple_table.jsx';
import PivotTable from '/client/modules/workplace/containers/preview/pivot_table';

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

const styles = {
  card: {
    forChart: {
      paddingTop: '40px',
      paddingBottom: '20px',
    },
    forTable: {
      overflowY: 'scroll',
      overflowX: 'hidden',
      paddingTop: '40px',
    },
  },
};

const DataVisualisation = props => {
  const { chart, dashboardId, meteorMethodCall, routeTo, heightIsFixed = false, maxHeight } = props;
  const { viewObject: { data, chartType, dataTimeStamp, pivot }, queryObject } = chart;
  const needRedraw = !dataTimeStamp || Date.now() - dataTimeStamp < 1000;

  const cardStyle = _.clone(chartType ? styles.card.forChart : styles.card.forTable);
  if (heightIsFixed) _.extend(cardStyle, { position: 'relative' });
  if (!chartType && heightIsFixed) {
    _.extend(cardStyle, {
      maxHeight: `${window.innerHeight - maxHeight + 60}px`,
      paddingLeft: '20px',
    });
  }

  return (
    <div className="data-visualisation" >
      <Card className="card chart" style={cardStyle}>
        <ChartHeader
          chart={chart}
          dashboardId={dashboardId}
          meteorMethodCall={meteorMethodCall}
          routeTo={routeTo}
        />
        {chartType && <ChartCanvas
          data={data}
          fields={queryObject.fields}
          chartType={chartType}
          heightIsFixed={heightIsFixed}
          maxHeight={maxHeight}
          needRedraw={needRedraw}
        />}
        {!chartType && (!!pivot ?
          <PivotTable chart={Object.assign(chart, { data })} /> :
          <SimpleTable chart={chart} />
        )}
        <ChartFooter
          chart={chart}
          meteorMethodCall={meteorMethodCall}
        />
      </Card>
    </div>
  );
};

DataVisualisation.propTypes = {
  chart: PropTypes.object.isRequired,
  dashboardId: PropTypes.string.isRequired,
  meteorMethodCall: PropTypes.func.isRequired,
  routeTo: PropTypes.func.isRequired,
  heightIsFixed: PropTypes.bool,
  maxHeight: PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.bool]),
};

export default DataVisualisation;
