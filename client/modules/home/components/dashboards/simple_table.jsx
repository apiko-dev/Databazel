import React, { PropTypes } from 'react';
import { Table, TableBody, TableRow, TableRowColumn, TableHeader, TableHeaderColumn,
} from 'material-ui/Table';

const styles = {
  tableCol: {
    height: 48,
    padding: '0 12px',
  },
};

const SimpleTable = props => {
  const { viewObject: { data }, queryObject } = props.chart;
  return (
    <div>
      <Table fixedHeader>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            {queryObject.fields.map((field, i) => (
              <TableHeaderColumn style={styles.tableCol} key={i}>
                {field.name || field}
              </TableHeaderColumn>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} className="table-body">
          {data.map((row, i) => (
            <TableRow key={i} selectable={false}>
              {queryObject.fields.map((field, j) => (
                <TableRowColumn key={j} style={styles.tableCol}>
                  {row[field.name || field]}
                </TableRowColumn>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

SimpleTable.propTypes = {
  chart: PropTypes.object.isRequired,
};

export default SimpleTable;
