import React, { PropTypes } from 'react';
import FontIcon from 'material-ui/FontIcon';
import { Table, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import { _ } from 'meteor/underscore';
import { grey200, grey300 } from 'material-ui/styles/colors';
import i18n from 'meteor/universe:i18n';
import dataProcessing from '/lib/data_processing';

const { reEscapeCharacters: reEsc, formatNumber } = dataProcessing;

const styles = {
  header: {
    root: {
      backgroundColor: grey200,
    },
    row: {
      border: 'none',
      height: '32px',
    },
    cellValue: {
      border: `1px solid ${grey300}`,
      textAlign: 'center',
      height: '32px',
      padding: '0 8px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    cellOther: {
      border: 'none',
      backgroundColor: 'white',
      height: '32px',
      padding: '0 8px',
      textAlign: 'center',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    cellTotal: {
      border: 'none',
      height: '32px',
      padding: '0 8px',
      textAlign: 'center',
      fontWeight: '600',
      color: 'rgb(66, 66, 66)',
      fontSize: '13px',
    },
  },
  iconStyles: {
    top: 2,
    color: 'rgb(158, 158, 158)',
    position: 'absolute',
  },
};

class PivotTableHeader extends React.Component {
  constructor(props) {
    super(props);
    this.sortByColumn = this.sortByColumn.bind(this);
    this.renderSortIcon = this.renderSortIcon.bind(this);
  }
  sortByColumn(col) {
    this.props.updateSorting(col);
  }
  renderSortIcon(column) { // Todo Oleg: move to partial components in core module
    const { sorting = [] } = this.props;
    const isObj = typeof column === 'object';
    const col = isObj ? _.omit(column, ['colGroup1Value', 'colGroup2Value']) : column;
    let sortOrder = false;
    sorting.forEach(sort => {
      if (_.isEqual(sort.col, col) || sort.col === col) sortOrder = sort.order;
    });
    if (!sortOrder) return null;
    return (
      <FontIcon
        className={!sortOrder ? 'material-icons rotate' : 'material-icons'}
        style={styles.iconStyles}
      >
        {sortOrder === 'desc' ? 'expand_less' : 'expand_more'}
      </FontIcon>
    );
  }
  render() {
    const { pivotColsHeaders, pivotModelExt, fields, columns = [] } = this.props;
    const { rowsNames, valuesExp, colsNames } = pivotModelExt;
    if (!rowsNames.length && !colsNames.length) return null;
    const valueName = valuesExp[0];
    const aggFunc = valueName && valueName.slice(0, valueName.indexOf('('));

    const Header = ({ i }) => { // the problem with iterating header and rendering it as method
      if (!colsNames[i] && i !== 0) return null;
      const isLast = colsNames.length ? i + 1 === colsNames.length : true;
      const { type, numberTemplate: template } = fields.find(f => f.id === columns[i]) || {};
      let colsToShow;
      if (isLast) {
        colsToShow = _.flatten(pivotColsHeaders);
      } else {
        if (i === 0) {
          if (colsNames.length === 2) {
            colsToShow = pivotColsHeaders.map(c => _.extend(c, { val: c[0].colGroup1Value }));
          } else {
            colsToShow = pivotColsHeaders.map(c => ({
              val: c[0][0].colGroup1Value,
              length: _.flatten(c).length,
            }));
          }
        } else {
          colsToShow = _.flatten(pivotColsHeaders, true)
            .map(c => _.extend(c, { val: c[0].colGroup2Value }));
        }
      }
      return (
        <TableRow key={colsNames[i]} style={styles.header.row}>
          {!rowsNames.length && valuesExp.length ?
            <TableHeaderColumn style={styles.header.cellOther} /> : ''}
          {rowsNames.map(rawName => (
            <TableHeaderColumn
              key={_.uniqueId()}
              style={styles.header.cellOther}
              onTouchTap={isLast ? () => this.sortByColumn(rawName) : ''}
            >
              {!isLast ? '' : rawName}
              {!isLast ? '' : this.renderSortIcon(rawName)}
            </TableHeaderColumn>
          ))}
          {colsToShow.map(col => {
            const val = isLast ? col[colsNames[i]] : col.val;
            return (
              <TableHeaderColumn
                key={_.uniqueId()}
                colSpan={isLast ? 1 : col.length}
                style={styles.header.cellValue}
                onTouchTap={isLast ? () => this.sortByColumn(col) : ''}
              >
                <span className="pivot-header-col">
                  {type === 'number' ? formatNumber(val, template) : reEsc(val)}
                </span>
                {isLast ? this.renderSortIcon(col) : ''}
              </TableHeaderColumn>
            );
          })}
          {valuesExp.length && (aggFunc !== 'AVG' || !colsToShow.length) ?
            <TableHeaderColumn
              style={styles.header.cellTotal}
              onTouchTap={isLast ? () => this.sortByColumn('ROW_TOTAL') : ''}
            >
              {isLast ? i18n.__('total') : ''}
              {isLast ? this.renderSortIcon('ROW_TOTAL') : ''}
            </TableHeaderColumn> : ''
          }
        </TableRow>
      );
    };

    return (
      <Table>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
          enableSelectAll={false}
          style={styles.header.root}
        >
          <Header i={0} />
          <Header i={1} />
          <Header i={2} />
        </TableHeader>
      </Table>
    );
  }
}

PivotTableHeader.propTypes = {
  pivotModelExt: PropTypes.object,
  pivotColsHeaders: PropTypes.array,
  sorting: PropTypes.array,
  updateSorting: PropTypes.func,
  fields: PropTypes.array,
  columns: PropTypes.array,
};

export default PivotTableHeader;
