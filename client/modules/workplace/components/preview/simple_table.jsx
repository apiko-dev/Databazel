import React, { PropTypes } from 'react';
import PreviewHeader from '../../containers/preview/preview_header';
import {
  Table, TableBody, TableRow, TableRowColumn, TableHeader,
} from 'material-ui/Table';
import { _ } from 'meteor/underscore';
import dataProcessing from '/lib/data_processing';

const { formatNumber } = dataProcessing;

class SimpleTable extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { data, chartType, fields } = this.props;
    const isDataChanged = !_.isEqual(data, nextProps.data);
    const isTypeChanged = chartType !== nextProps.chartType;
    const isFieldsChanged = !isEqualObjectArrays(fields, nextProps.fields);

    function isEqualObjectArrays(arr1, arr2) {
      for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
        if (!_.isEqual(arr1[i], arr2[i])) return false;
      }
      return true;
    }

    return isTypeChanged || isDataChanged || isFieldsChanged;
  }
  renderTableCol(row, field, key) {
    let value = row[field.name];
    if (_.isNumber(value)) value = formatNumber(value, field.numberTemplate);
    return <TableRowColumn key={key}>{`${value}`}</TableRowColumn>;
  }
  render() {
    const { fields, chartType, data, isLoading } = this.props;
    const tableHeight = !chartType && !!data ? `${window.innerHeight - 236}px` : 'auto';
    return (
      <Table height={tableHeight} fixedHeader>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <PreviewHeader fields={fields} chartType={chartType} />
        </TableHeader>

        {!chartType && !!data && !isLoading ?
          <TableBody displayRowCheckbox={false} className="chartdata-table-body">
            {data.map((row, i) => (
              <TableRow key={i} selectable={false}>
                {fields.map((field, j) => this.renderTableCol(row, field, j))}
                <TableRowColumn />
              </TableRow>
            ))}
          </TableBody>
        : ''}
      </Table>
    );
  }
}

SimpleTable.propTypes = {
  chartType: PropTypes.string,
  isLoading: PropTypes.bool,
  data: PropTypes.array,
  fields: PropTypes.array,
};

export default SimpleTable;
