import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import ShareDashboards from '../containers/share_dashboards';
import ShareCharts from '../containers/share_charts';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import Toggle from 'material-ui/Toggle';
import { grey400 } from 'material-ui/styles/colors';
import { TableRow, TableHeaderColumn } from 'material-ui/Table';

const styles = {
  icon: {
    cursor: 'pointer',
  },
  col: {
    index: {
      width: '40px',
    },
    email: {
      fontSize: '16px',
      color: 'fff',
    },
    actions: {
      paddingLeft: '0px',
      width: '145px',
    },
  },
};
export default class UserItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isAdmin: !!props.user.isAdmin };
    this.openDialogToDeleteUser = this.openDialogToDeleteUser.bind(this);
    this.setUserPermissions = this.setUserPermissions.bind(this);
  }

  setUserPermissions() {
    const { meteorMethodCall, user } = this.props;
    const isAdmin = this.state.isAdmin;
    meteorMethodCall('users.setPermissions', {
      userId: user._id,
      isAdmin: !isAdmin,
    });
    this.setState({ isAdmin: !isAdmin });
  }

  openDialogToDeleteUser() {
    const { user, setIsDialogDeleteOpen, setUserToDelete } = this.props;
    setUserToDelete(user);
    setIsDialogDeleteOpen(true);
  }

  render() {
    const { user, rowNumber } = this.props;
    return (
      <TableRow>
        <TableHeaderColumn style={styles.col.index}>{rowNumber + 1}</TableHeaderColumn>
        <TableHeaderColumn style={styles.col.email}>{user.getEmail()}</TableHeaderColumn>
        <TableHeaderColumn>
          {user.isVerified() ? i18n.__('verified') : i18n.__('not_verified')}
        </TableHeaderColumn>
        <TableHeaderColumn>
          {!user.isMe() ?
            <Toggle
              toggled={this.state.isAdmin}
              onToggle={this.setUserPermissions}
            />
            : ''
          }
        </TableHeaderColumn>
        <TableHeaderColumn style={styles.col.actions}>
          {!user.isAdmin ?
            <div>
              <ShareDashboards userId={user._id} />
              <ShareCharts userId={user._id} />
              <IconButton
                onTouchTap={this.openDialogToDeleteUser}
                tooltip={i18n.__('delete')}
                tooltipPosition="top-center"
              >
                <ActionDelete color={grey400} />
              </IconButton>
            </div>
          : ''}
        </TableHeaderColumn>
      </TableRow>
    );
  }
}

UserItem.propTypes = {
  user: PropTypes.object,
  rowNumber: PropTypes.number,
  setIsDialogDeleteOpen: PropTypes.func,
  setUserToDelete: PropTypes.func,
  meteorMethodCall: PropTypes.func,
};
