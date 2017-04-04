import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import PublicIcon from 'material-ui/svg-icons/social/public';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ExportImageMenuItem from '../../../core/components/export_to_image/export_images_menu_item';
import IframeDialog from '../../../publishing/containers/iframe_dialog';

const styles = {
  actionsMenu: {
    root: {
      position: 'absolute',
      right: '15px',
    },
    tooltip: {
      height: '24px',
    },
  },
  imageButton: {
    icon: {
      color: 'grey',
    },
  },
  editButton: {
    root: {
      width: '24px',
      height: '24px',
      position: 'absolute',
      padding: '',
      right: '-2px',
      top: '13px',
    },
    icon: {
      color: 'grey',
      fontSize: '18px',
    },
  },
  caption: {
    root: {
      position: 'absolute',
      left: '50%',
      marginLeft: '-128px',
    },
    input: {
      textAlign: 'center',
    },
  },
};

class ChartHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { iframeDialogOpen: false };
    this.removeChartFromDashboard = this.removeChartFromDashboard.bind(this);
    this.renameChart = this.renameChart.bind(this);
    this.handleEditChart = this.handleEditChart.bind(this);
    this.handleIframeDialog = this.handleIframeDialog.bind(this);
  }
  handleIframeDialog() {
    this.setState({ iframeDialogOpen: !this.state.iframeDialogOpen });
  }
  handleEditChart() {
    this.props.routeTo('chartEditor', { chartId: this.props.chart._id });
  }
  removeChartFromDashboard() {
    this.props.meteorMethodCall('dashboard.removeChartFromDashboard', {
      chartId: this.props.chart._id,
      dashboardId: this.props.dashboardId,
    });
  }
  renameChart(e) {
    this.props.meteorMethodCall('chart.renameChart', {
      chartId: this.props.chart._id,
      newName: e.currentTarget.value,
    });
  }

  render() {
    const { chart: { chartName, _id, isPublished } } = this.props;
    return (
      <div className="header">
        <IframeDialog
          open={this.state.iframeDialogOpen}
          isPublished={!!isPublished}
          handleIframeDialog={this.handleIframeDialog}
          chartId={_id}
        />
        <TextField
          name={chartName}
          className={`${_id}name chart-name`}
          style={styles.caption.root}
          inputStyle={styles.caption.input}
          textareaStyle={styles.caption.textArea}
          defaultValue={chartName}
          onBlur={this.renameChart}
        />
        <IconMenu
          style={styles.actionsMenu.root}
          iconButtonElement={
            <IconButton tooltip={i18n.__('actions')} tooltipStyles={styles.actionsMenu.tooltip}>
              <MoreVertIcon color="grey" />
            </IconButton>
          }
        >
          <MenuItem
            primaryText={i18n.__(isPublished ? 'settings_publication' : 'publish')}
            onTouchTap={this.handleIframeDialog}
            leftIcon={<PublicIcon />}
          />
          <ExportImageMenuItem
            chartsId={[_id]}
            iconStyle={styles.imageButton.icon}
          />
          <MenuItem
            primaryText={i18n.__('remove_from_dashboard')}
            leftIcon={<ActionDelete color="grey" />}
            onTouchTap={this.removeChartFromDashboard}
          />
        </IconMenu>
        <IconButton
          iconClassName="material-icons"
          onTouchTap={this.handleEditChart}
          tooltip={i18n.__('edit_chart')}
          style={styles.editButton.root}
          iconStyle={styles.editButton.icon}
          children={'edit'}
        />
      </div>
    );
  }
}

ChartHeader.propTypes = {
  chart: PropTypes.object.isRequired,
  dashboardId: PropTypes.string.isRequired,
  meteorMethodCall: PropTypes.func.isRequired,
  routeTo: PropTypes.func.isRequired,
};

export default ChartHeader;
