import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import HandleUsersMenuItem from '../../containers/dashboards/handle_users_menu_item';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import ContentCopyIcon from 'material-ui/svg-icons/content/content-copy';
import { Card, CardMedia } from 'material-ui/Card';
import { white, transparent, grey600 } from 'material-ui/styles/colors';
import HandleImages
  from '/client/modules/core/components/export_to_image/export_images_menu_item.jsx';

const styles = {
  card: {
    media: {
      cursor: 'pointer',
      minHeight: '180px',
    },
  },
  dashboardName: {
    input: {
      fontSize: '1.3em',
      color: white,
      padding: '0px 12px',
    },
    underlineStyle: {
      borderColor: transparent,
      marginLeft: '10px',
      width: '95%',
    },
    underlineFocusStyle: {
      borderColor: white,
      marginLeft: '10px',
      width: '95%',
    },
  },
  buttons: {
    remove: {
      root: {
        position: 'absolute',
        top: '5px',
        right: '5px',
      },
    },
    actions: {
      root: {
        position: 'absolute',
        top: '5px',
        right: '35px',
      },
    },
  },
};

class DashboardItem extends React.Component {
  constructor() {
    super();
    this.goToDashboard = this.goToDashboard.bind(this);
    this.removeDashboard = this.removeDashboard.bind(this);
    this.copyDashboard = this.copyDashboard.bind(this);
    this.renameDashboard = this.renameDashboard.bind(this);
  }
  goToDashboard(e) {
    const { routeTo, dashboard: { _id: dashboardId } } = this.props;
    if (e.target.tagName === 'DIV') routeTo('dashboard', { dashboardId });
  }
  removeDashboard() {
    const confirm = {
      message: 'Are you sure you want to permanently delete this dashboard?',
      options: {
        confirmLabel: 'Confirm',
        cancelLabel: 'Cancel',
        title: 'Delete dashboard',
      },
    };
    function notify(err, res, Notificator) {
      if (err) {
        Notificator.snackbar(err.message || 'Server error', 'negative');
      }
    }
    this.props.meteorMethodCall(
      'dashboard.remove',
      { dashboardId: this.props.dashboard._id },
      notify,
      confirm
    );
  }
  copyDashboard() {
    this.props.meteorMethodCall('dashboard.copy', { dashboardId: this.props.dashboard._id });
  }
  renameDashboard(e) {
    this.props.meteorMethodCall('dashboard.rename', {
      dashboardId: this.props.dashboard._id,
      newName: e.currentTarget.value,
    });
  }
  render() {
    const { dashboard } = this.props;
    if (dashboard) {
      return (
        <Card>
          <CardMedia
            style={styles.card.media}
            onTouchTap={this.goToDashboard}
            overlay={
              <TextField
                name="chartName"
                fullWidth
                defaultValue={dashboard.name}
                onBlur={this.renameDashboard}
                inputStyle={styles.dashboardName.input}
                underlineStyle={styles.dashboardName.underlineStyle}
                underlineFocusStyle={styles.dashboardName.underlineFocusStyle}
              />
            }
          >
            <img src="/images/background-min.jpg" alt={dashboard.name} />
          </CardMedia>

          <IconButton
            style={styles.buttons.remove.root}
            tooltip={i18n.__('delete')}
            onTouchTap={this.removeDashboard}
          >
            <DeleteIcon color={grey600} />
          </IconButton>
          <IconMenu
            style={styles.buttons.actions.root}
            iconButtonElement={
              <IconButton tooltip={i18n.__('actions')}><MoreVertIcon color={grey600} /></IconButton>
            }
          >
            <HandleImages
              chartsId={dashboard.chartsId}
              dashboardName={dashboard.name}
            />
            <MenuItem
              primaryText={i18n.__('copy')}
              onTouchTap={this.copyDashboard}
              leftIcon={<ContentCopyIcon color={grey600} />}
            />
            <HandleUsersMenuItem dashboardId={dashboard._id} color={grey600} />
          </IconMenu>
        </Card>
      );
    }
    return null;
  }
}

DashboardItem.propTypes = {
  dashboard: PropTypes.object,
  routeTo: PropTypes.func.isRequired,
  meteorMethodCall: PropTypes.func.isRequired,
};

export default DashboardItem;
