import React, { PropTypes } from 'react';
import FontIcon from 'material-ui/FontIcon';

const styles = {
  icon: {
    fontSize: 20,
    marginLeft: -5,
    marginTop: 11,
  },
};

class ToggleSidebarStateTab extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { isOpened, onTouchTap } = this.props;
    let className = 'toggle-sidebar-state-tab ';
    className += isOpened ? 'opened' : 'closed';
    return (
      <div onTouchTap={onTouchTap} className={className}>
        <FontIcon
          className="material-icons"
          style={styles.icon}
        >
        {isOpened ? 'chevron_left' : 'chevron_right'}
        </FontIcon>
      </div>
    );
  }
}

ToggleSidebarStateTab.propTypes = {
  isOpened: PropTypes.bool,
  onTouchTap: PropTypes.func,
};

export default ToggleSidebarStateTab;
