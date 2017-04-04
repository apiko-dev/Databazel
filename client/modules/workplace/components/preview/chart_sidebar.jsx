import React, { PropTypes } from 'react';
import Toggle from 'material-ui/Toggle';
import ChartTypeButton from './chart_type_button.jsx';
import SaveChartForm from '../../containers/preview/save_chart_form';
import SQLButton from '../sql_editor/sql_button.jsx';
import PreviewHandleUsers from '../../../home/containers/charts/handle_users';
import HandlePublicationButton
  from '/client/modules/publishing/components/handle_publications_button';

const styles = {
  labelStyle: {
    float: 'none',
    textAlign: 'center',
    width: '100%',
  },
  iconStyle: {
    marginLeft: 12,
  },
  test: {
    display: 'block',
  },
};

class ChartSidebar extends React.Component {
  render() {
    const { chartId, chartType, isLive, getCurrentData,
      updateViewObj, toggleRenderState, query, setSQLQuery, isPublished } = this.props;
    return (
      <div className="chart-sidebar">
        <div className="sidebar-content">
          <ChartTypeButton
            isLive={isLive}
            updateViewObj={updateViewObj}
            chartType={chartType}
          />
          <SaveChartForm chartId={chartId} getCurrentData={getCurrentData} />
          <SQLButton query={query} setSQLQuery={setSQLQuery} />
          {chartId ? <HandlePublicationButton chartId={chartId} isPublished={!!isPublished} /> : ''}
          {chartId ? <PreviewHandleUsers chartId={chartId} /> : ''}
        </div>
        <div className="sidebar-footer">
          <Toggle
            label="Live"
            labelPosition="left"
            onToggle={toggleRenderState}
            className="toggle-column"
            labelStyle={styles.labelStyle}
            iconStyle={styles.iconStyle}
            toggled={isLive}
          />
        </div>
      </div>
    );
  }
}

ChartSidebar.propTypes = {
  isLive: PropTypes.bool,
  toggleRenderState: PropTypes.func,
  updateViewObj: PropTypes.func,
  getCurrentData: PropTypes.func,
  setSQLQuery: PropTypes.func,
  chartId: PropTypes.string,
  chartType: PropTypes.string,
  query: PropTypes.string,
  isPublished: PropTypes.bool,
};

export default ChartSidebar;
