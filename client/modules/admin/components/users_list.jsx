import React, { PropTypes } from 'react';
import UserItem from './user_item.jsx';
import DialogDelete from './dialog_delete.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Paper from 'material-ui/Paper';
import i18n from 'meteor/universe:i18n';
import {
  Table, TableBody, TableHeader, TableHeaderColumn, TableRow,
} from 'material-ui/Table';

const styles = {
  buttonDiv: {
    textAlign: 'right',
    marginBottom: '12px',
  },
  tableBody: {
    overflow: 'visible',
  },
  col: {
    index: {
      width: '40px',
    },
    actions: {
      width: '145px',
    },
  },
};

class UsersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDialogDeleteOpen: false,
      userToDelete: false,
    };
    this.setIsDialogDeleteOpen = this.setIsDialogDeleteOpen.bind(this);
    this.setUserToDelete = this.setUserToDelete.bind(this);
  }

  setUserToDelete(user) {
    this.setState({
      userToDelete: user,
    });
  }

  setIsDialogDeleteOpen(isOpen) {
    this.setState({
      isDialogDeleteOpen: isOpen,
    });
  }

  render() {
    const { users, deleteUser, inviteUser } = this.props;
    return (
      <div className="row">
        <div style={styles.buttonDiv} className="row col-xs-12">
          <RaisedButton
            label="Invite user"
            onClick={inviteUser}
            icon={<ContentAdd />}
          />
        </div>

        <div className="col-xs-12">
          <Paper zDepth={1}>
            <Table bodyStyle={styles.tableBody}>
              <TableHeader
                displaySelectAll={false}
                enableSelectAll={false}
                adjustForCheckbox={false}
              >
                <TableRow>
                  <TableHeaderColumn style={styles.col.index}>#</TableHeaderColumn>
                  <TableHeaderColumn>{i18n.__('email')}</TableHeaderColumn>
                  <TableHeaderColumn>{i18n.__('status')}</TableHeaderColumn>
                  <TableHeaderColumn>{i18n.__('is_admin')}</TableHeaderColumn>
                  <TableHeaderColumn style={styles.col.actions}>
                    {i18n.__('actions')}
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((user, index) => (
                  <UserItem
                    key={index}
                    user={user}
                    setUserToDelete={this.setUserToDelete}
                    setIsDialogDeleteOpen={this.setIsDialogDeleteOpen}
                    meteorMethodCall={this.props.meteorMethodCall}
                  />
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>

        <DialogDelete
          deleteUser={deleteUser}
          user={this.state.userToDelete}
          setIsDialogDeleteOpen={this.setIsDialogDeleteOpen}
          isOpen={this.state.isDialogDeleteOpen}
        />
      </div>
    );
  }
}

UsersList.propTypes = {
  users: PropTypes.array,
  inviteUser: PropTypes.func,
  deleteUser: PropTypes.func,
  meteorMethodCall: PropTypes.func,
};

export default UsersList;
