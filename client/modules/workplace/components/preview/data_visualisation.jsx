import React, { PropTypes } from 'react';
import ChartCanvas from './chart_canvas.jsx';
import PreviewPagination from './preview_pagination.jsx';
import Loading from '/client/modules/core/components/partial/loading.jsx';
import SimpleTable from './simple_table.jsx';
import PivotTable from '/client/modules/workplace/containers/preview/pivot_table';
import { CardText } from 'material-ui/Card';

class DataVisualisation extends React.Component {
  componentWillUpdate(nextProps) {
    const { updateToolbarValues } = this.props;
    const nextValues = nextProps.data && nextProps.data[0];
    updateToolbarValues(nextValues);
  }

  componentWillUnmount() {
    this.props.resetData();
  }

  render() {
    const { data = [], queryObject, viewObject, tableType, isLive, isLoading,
      updateSQLQueryObj } = this.props;
    const { chartType } = viewObject;
    const tableHeight = `${window.innerHeight - 74}px`;
    return (
      <div className="data-visualisation">
        {tableType === 'simple' &&
          <SimpleTable
            fields={queryObject.fields}
            data={data}
            chartType={chartType}
            isLoading={isLoading}
          />}

        {!chartType && tableType === 'pivot' && !isLoading && isLive &&
          <div className="pivot-table" style={{ maxHeight: tableHeight }}>
            <PivotTable chart={{ queryObject, viewObject, data }} />
          </div>}

        {chartType && !!data &&
          <CardText className="data-visualisation">
            <ChartCanvas
              data={data}
              fields={queryObject.fields}
              tableType={tableType}
              chartType={chartType}
              heightIsFixed
              needRedraw
            />
          </CardText>}

        {!!data && tableType === 'simple' &&
          <div className="preview-footer">
            <PreviewPagination
              pagination={queryObject.pagination}
              updateSQLQueryObj={updateSQLQueryObj}
              itemsCount={data.length}
            />
          </div>}

        {isLoading ? <Loading preview /> : ''}
      </div>
    );
  }
}

DataVisualisation.propTypes = {
  tableType: PropTypes.string,
  isLoading: PropTypes.bool,
  isLive: PropTypes.bool,
  queryObject: PropTypes.object,
  viewObject: PropTypes.object,
  data: PropTypes.array,
  updateSQLQueryObj: PropTypes.func,
  updateToolbarValues: PropTypes.func,
  resetData: PropTypes.func,
  updateSorting: PropTypes.func,
  processDateField: PropTypes.func,
};

export default DataVisualisation;
