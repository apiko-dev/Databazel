import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import MenuItem from 'material-ui/MenuItem';
import UserMenuItem from './user_menu_item.jsx';
import SocialPeople from 'material-ui/svg-icons/social/people';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import { grey400 } from 'material-ui/styles/colors';

class HandleUsersMenuItem extends React.Component {
  render() {
    const { users, selectedUsers, entityId, meteorMethodCall, entityType, color } = this.props;
    return (
      <MenuItem
        primaryText={i18n.__('share')}
        leftIcon={<SocialPeople color={color || grey400} />}
        rightIcon={<ArrowDropRight />}
        menuItems={users && users.length ?
          users.map(user =>
            <UserMenuItem
              key={user._id}
              user={user}
              isChecked={user.isShared({ entityType, entityId })}
              entityType={entityType}
              sharingEntityId={entityId}
              selectedUsers={selectedUsers}
              meteorMethodCall={meteorMethodCall}
            />
          ) :
          [<MenuItem
            key="no_user_yet"
            primaryText={i18n.__('no_user_yet')}
            disabled
          />]
        }
      />
    );
  }
}

HandleUsersMenuItem.propTypes = {
  users: PropTypes.array,
  entityType: PropTypes.string,
  selectedUsers: PropTypes.array,
  entityId: PropTypes.string,
  meteorMethodCall: PropTypes.func.isRequired,
  color: PropTypes.string,
};

export default HandleUsersMenuItem;
