import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import T from '/lib/i18n';

export default class DialogDelete extends React.Component {
  constructor(props) {
    super(props);
    this.deleteUser = this.deleteUser.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  deleteUser() {
    const { user, deleteUser, setIsDialogDeleteOpen } = this.props;
    deleteUser(user._id);
    setIsDialogDeleteOpen(false);
  }

  closeDialog() {
    this.props.setIsDialogDeleteOpen(false);
  }

  render() {
    const { user, isOpen } = this.props;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.closeDialog}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.deleteUser}
      />,
    ];

    return (
      <div>
        <Dialog
          title="Confirm Deleting"
          actions={actions}
          modal={false}
          open={isOpen}
          onRequestClose={this.closeDialog}
        >
          <T>confirm_delete_user</T> <strong>{user && user.getEmail()}</strong>?
        </Dialog>
      </div>
    );
  }
}

DialogDelete.propTypes = {
  user: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  deleteUser: PropTypes.func,
  setIsDialogDeleteOpen: PropTypes.func,
  isOpen: PropTypes.bool,
};
