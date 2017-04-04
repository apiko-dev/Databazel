import React, { PropTypes } from 'react';
import MenuItem from 'material-ui/MenuItem';

class UserMenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(user) {
    const { sharingEntityId, meteorMethodCall, entityType, isChecked } = this.props;
    meteorMethodCall(`${entityType}.handleSharingToUser`, {
      entityId: sharingEntityId,
      userId: user._id,
      isSharing: !isChecked,
    });
  }
  render() {
    const { user, selectedUsers, isChecked } = this.props;
    return (
      <MenuItem
        primaryText={user.getEmail()}
        checked={isChecked}
        insetChildren={selectedUsers && !!selectedUsers.length && !isChecked}
        onTouchTap={() => this.handleChange(user)}
      />
    );
  }
}

UserMenuItem.propTypes = {
  isChecked: PropTypes.bool,
  entityType: PropTypes.string,
  sharingEntityId: PropTypes.string,
  selectedUsers: PropTypes.array,
  user: PropTypes.object,
  meteorMethodCall: PropTypes.func.isRequired,
};

export default UserMenuItem;
