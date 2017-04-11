import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import moment from 'moment';
import { TextField, Toggle, IconMenu, MenuItem, IconButton, CircularProgress } from 'material-ui';
import { grey400, transparent } from 'material-ui/styles/colors';
import { TableHeaderColumn, TableRow } from 'material-ui/Table';
import { milisecondsInDay } from '/lib/constants';
import HandleDashboards from '../../containers/charts/handle_dashboards';
import HandleUsersMenuItem from '../../containers/charts/handle_users_menu_item';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ContentCreate from 'material-ui/svg-icons/content/create';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';

const styles = {
  col: {
    index: { width: '40px' },
    name: { minWidth: '200px' },
    refreshed: { width: '224px' },
    autorefresh: { width: '90px' },
    collection: { width: '200px' },
    length: { width: '100px' },
    usage: {
      width: '145px',
      paddingLeft: '0px',
      paddingRight: '0px',
    },
    actions: {
      width: '145px',
      paddingLeft: '-24px',
      paddingRight: '0px',
    },
  },
  row: {
    height: '65px',
  },
  handleButton: {
    top: '-7px',
  },
  progress: {
    top: '-12px',
    left: '-8px',
  },
};

class ChartItem extends React.Component {
  constructor() {
    super();
    this.deleteChart = this.deleteChart.bind(this);
    this.copyChart = this.copyChart.bind(this);
    this.renameChart = this.renameChart.bind(this);
    this.handleChartAutorefresh = this.handleChartAutorefresh.bind(this);
    this.exportDataToCsv = this.exportDataToCsv.bind(this);
  }
  exportDataToCsv() {
    this.setState({ exportInProgress: true });
    this.props.exportDataToCsv(this);
  }
  deleteChart() {
    this.props.meteorMethodCall('chart.remove', { chartId: this.props.chart._id });
  }
  copyChart() {
    this.props.meteorMethodCall('chart.copy', { chartId: this.props.chart._id });
  }
  renameChart({ currentTarget: { value: newName } }) {
    const { meteorMethodCall, chart: { _id: chartId } } = this.props;
    meteorMethodCall('chart.renameChart', { chartId, newName });
  }
  handleChartAutorefresh({ currentTarget: { checked: autorefresh } }) {
    const { meteorMethodCall, chart: { _id: chartId } } = this.props;
    meteorMethodCall('chart.handleChartAutorefresh', { chartId, autorefresh });
  }
  render() {
    const { index, routeTo, chart: { _id, chartName, autorefresh,
      viewObject: { dataTimeStamp, data = [] }, queryObject: { from },
    } } = this.props;
    const isExportInProgress = this.state && this.state.exportInProgress;
    return (
      <TableRow style={styles.row}>
        <TableHeaderColumn style={styles.col.index}>{index + 1}</TableHeaderColumn>
        <TableHeaderColumn>
          <TextField
            name={chartName}
            defaultValue={chartName}
            onBlur={this.renameChart}
            underlineStyle={{ borderColor: transparent }}
          />
        </TableHeaderColumn>
        <TableHeaderColumn style={styles.col.refreshed}>
          {moment(dataTimeStamp).fromNow()}
          {Date.now() - dataTimeStamp > milisecondsInDay ?
            `  (${moment(dataTimeStamp).format('Do MMM YY, HH:mm')})`
          : ''}
        </TableHeaderColumn>
        <TableHeaderColumn style={styles.col.autorefresh}>
          <Toggle
            defaultToggled={autorefresh}
            onToggle={this.handleChartAutorefresh}
            tooltip={i18n.__('join_collection')}
            tooltipPosition="top-center"
          />
        </TableHeaderColumn>
        <TableHeaderColumn style={styles.col.collection}>{from}</TableHeaderColumn>
        <TableHeaderColumn style={styles.col.length} >{data.length}</TableHeaderColumn>
        <TableHeaderColumn style={styles.col.actions}>
          <IconMenu
            iconButtonElement={
              <IconButton
                tooltip={i18n.__('actions')}
                tooltipPosition="top-center"
                children={<MoreVertIcon color={grey400} />}
              />}
          >
            <HandleDashboards chartId={_id} />
            <HandleUsersMenuItem chartId={_id} />
            <MenuItem
              primaryText={i18n.__('download_csv')}
              onTouchTap={this.exportDataToCsv}
              disabled={isExportInProgress}
              leftIcon={isExportInProgress ?
                <CircularProgress size={20} style={styles.progress} />
              : <FileFileDownload color={grey400} />
              }
            />
            <MenuItem
              primaryText={i18n.__('copy')}
              onTouchTap={this.copyChart}
              leftIcon={<ContentCopy color={grey400} />}
            />
          </IconMenu>
          <IconButton
            tooltip={i18n.__('edit')}
            tooltipPosition="top-center"
            onTouchTap={() => routeTo('chartEditor', { chartId: _id })}
            children={<ContentCreate color={grey400} />}
          />
          <IconButton
            tooltip={i18n.__('delete')}
            tooltipPosition="top-center"
            onTouchTap={this.deleteChart}
            children={<ActionDelete color={grey400} />}
          />
        </TableHeaderColumn>
      </TableRow>
    );
  }
}

ChartItem.propTypes = {
  chart: PropTypes.object,
  index: PropTypes.number,
  routeTo: PropTypes.func.isRequired,
  exportDataToCsv: PropTypes.func,
  meteorMethodCall: PropTypes.func.isRequired,
};

export default ChartItem;
