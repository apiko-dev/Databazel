import React, { PropTypes } from 'react';
import ChartItem from './item';
import { Paper, FloatingActionButton } from 'material-ui';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import ContentAdd from 'material-ui/svg-icons/content/add';

const styles = {
  addChartButton: {
    notEmpty: {
      position: 'fixed',
      right: '30px',
      bottom: '30px',
    },
    empty: {
      position: 'fixed',
      left: '50%',
      marginLeft: '-28px',
      top: '50%',
      marginTop: '-28px',
    },
  },
  tableBody: {
    overflow: 'visible',
  },
};

const ChartsList = ({ charts, routeTo, meteorMethodCall, exportDataToCsv }) => (
  <div className="row">
    <div className="col-xs-12">
      {charts.length ?
        <Paper zDepth={1}>
          <Table bodyStyle={styles.tableBody}>
            <TableHeader
              adjustForCheckbox={false}
              displaySelectAll={false}
              enableSelectAll={false}
            >
              <TableRow>
                <TableHeaderColumn style={{ width: '40px' }} >#</TableHeaderColumn>
                <TableHeaderColumn style={{ minWidth: '200px' }}>Name</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '224px' }}>Refreshed</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '90px' }}>Autorefresh</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '200px' }}>Collection</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '100px' }}># of records</TableHeaderColumn>
                <TableHeaderColumn style={{ width: '145px' }}>Actions</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {charts && charts.map((chart, index) => (
                <ChartItem
                  chart={chart}
                  key={chart._id}
                  index={index}
                  routeTo={routeTo}
                  meteorMethodCall={meteorMethodCall}
                  exportDataToCsv={exportDataToCsv}
                />
              ))}
            </TableBody>
          </Table>
        </Paper>
      : <div>No charts are available yet</div>}
      <FloatingActionButton
        onTouchTap={() => routeTo('workplace')}
        style={styles.addChartButton[charts && charts.length === 0 ? 'empty' : 'notEmpty']}
        children={<ContentAdd />}
      />
    </div>
  </div>
);

ChartsList.propTypes = {
  charts: PropTypes.array,
  routeTo: PropTypes.func.isRequired,
  meteorMethodCall: PropTypes.func.isRequired,
  exportDataToCsv: PropTypes.func,
};

export default ChartsList;
