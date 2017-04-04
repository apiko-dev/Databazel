import React, { PropTypes } from 'react';
import PivotTableHeader from './pivot_table_header.jsx';
import i18n from 'meteor/universe:i18n';
import { Table, TableBody, TableRow, TableRowColumn } from 'material-ui/Table';
import { _ } from 'meteor/underscore';
import { grey200 } from 'material-ui/styles/colors';
import dataProcessing from '/lib/data_processing';

const { reEscapeCharacters: reEsc, formatNumber } = dataProcessing;
const styles = {
  body: {
    row: {
      valign: 'top',
      height: '32px',
    },
    cellHeader: {
      backgroundColor: grey200,
      height: '32px',
      padding: '8px',
      verticalAlign: 'top',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    cellValue: {
      height: '32px',
      padding: '0 1% 0 0',
      textAlign: 'right',
    },
  },
};

const PivotTable = ({ viewObject, pivotData: data, pivotColsHeaders, updateSorting,
  pivotModelExt, aggregate, fields }) => {
  const { pivot: { isValuesColored, sorting, model: { values, rows, columns } } } = viewObject;
  const { rowsNames, valuesExp } = pivotModelExt;
  const aggFunc = valuesExp[0] && valuesExp[0].slice(0, valuesExp[0].indexOf('('));
  const colsToShow = _.flatten(pivotColsHeaders)
    .map(col => _.values(_.omit(col, ['colGroup1Value', 'colGroup2Value'])).join('ՖՖՖ'));
  if (valuesExp.length) colsToShow.push('ROW_TOTAL');
  const template = aggFunc && fields.find(f => f.id === values[0]).numberTemplate;
  const valuesToFormat = _.flatten(
      _.flatten(data).map(d => _.values(_.pick(d, colsToShow.filter(c => c !== 'ROW_TOTAL'))))
    ).filter(val => typeof val === 'number' && !isNaN(val));
  const minVal = Math.min(...valuesToFormat);
  const maxVal = Math.max(...valuesToFormat);
  const getColor = val => dataProcessing.getLighterHslColor({ val, minVal, maxVal });

  const renderRowCols = row => colsToShow.map(COL_KEY => {
    if (aggFunc === 'AVG' && COL_KEY === 'ROW_TOTAL' && colsToShow.length !== 1) return null;
    return (
      <TableRowColumn
        key={_.uniqueId()}
        style={_.extend(_.clone(styles.body.cellValue), isValuesColored && COL_KEY !== 'ROW_TOTAL' ?
          { backgroundColor: getColor(row[COL_KEY]) } : {}
        )}
        className={COL_KEY === 'ROW_TOTAL' ? 'pivot-total' : ''}
      >
        {aggFunc && dataProcessing.formatNumber(row[COL_KEY], template)}
      </TableRowColumn>
    );
  });
  const renderRowHeader = (rowG, i) => {
    const isGroup = typeof i === 'number';
    const field = fields.find(f => f.id === rows[isGroup ? i : rows.length - 1]);
    const val = isGroup ? _.flatten(rowG)[0][rowsNames[i]] : rowG[rowsNames[rowsNames.length - 1]];
    return (
      <TableRowColumn
        rowSpan={isGroup ? _.flatten(rowG).length : 1}
        style={styles.body.cellHeader}
        children={field.type === 'number' ? formatNumber(val, field.numberTemplate) : reEsc(val)}
      />
    );
  };
  const renderColTotal = () => colsToShow.map(COL_KEY => (
    <TableRowColumn
      key={_.uniqueId()}
      style={styles.body.cellValue}
      children={formatNumber(aggregate(_.flatten(data).map(r => r[COL_KEY]), aggFunc), template)}
    />
  ));
  return (
    <div style={_.isEmpty(valuesExp) && _.isEmpty(pivotColsHeaders) ? { width: '50%' } : {}}>
      {!_.isEmpty(data) &&
        <PivotTableHeader
          pivotColsHeaders={pivotColsHeaders}
          pivotModelExt={pivotModelExt}
          updateSorting={updateSorting}
          sorting={sorting}
          fields={fields}
          columns={columns}
        />}
      {!_.isEmpty(data) &&
        <Table>
          <TableBody displayRowCheckbox={false}>
            {rowsNames.length === 1 && data.map(row => (
              <TableRow key={_.uniqueId()} style={styles.body.row}>
                {renderRowHeader(row)}
                {renderRowCols(row)}
              </TableRow>
            ))}
            {rowsNames.length === 2 && data.map(rowGroup => (
              rowGroup.map((row, i) => (
                <TableRow key={_.uniqueId()} style={styles.body.row}>
                  {!i ? renderRowHeader(rowGroup, 0) : ''}
                  {renderRowHeader(row)}
                  {renderRowCols(row)}
                </TableRow>
              ))
            ))}
            {rowsNames.length === 3 && data.map(rowGroup1 => (
              rowGroup1.map((rowGroup2, j) => (
                rowGroup2.map((row, i) => (
                  <TableRow key={_.uniqueId()} style={styles.body.row}>
                    {!j && !i ? renderRowHeader(rowGroup1, 0) : ''}
                    {!i ? renderRowHeader(rowGroup2, 1) : ''}
                    {renderRowHeader(row)}
                    {renderRowCols(row)}
                  </TableRow>
                ))
              ))
            ))}
            {valuesExp.length && aggFunc !== 'AVG' ? (
              <TableRow style={styles.body.row} className={'pivot-total'}>
                <TableRowColumn
                  colSpan={rowsNames.length || 1}
                  style={styles.body.cellHeader}
                  children={i18n.__('total')}
                />
                {renderColTotal()}
              </TableRow>
            ) : ''}
          </TableBody>
        </Table>}
    </div>
  );
};

PivotTable.propTypes = {
  pivotData: PropTypes.array,
  pivotModelExt: PropTypes.object,
  viewObject: PropTypes.object,
  pivotColsHeaders: PropTypes.array,
  updateSorting: PropTypes.func,
  aggregate: PropTypes.func,
  fields: PropTypes.array,
};

export default PivotTable;
