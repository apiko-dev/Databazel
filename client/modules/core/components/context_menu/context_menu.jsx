/*
Dictionary:
  * target - element that should have context menu
  * root component - component which render target

To use context menu you should:
  0. wrap target with <ContextMeu>
  1. path "contextMenuItems" prop - array of <ListItem> (material-ui component)
  2. path "itemsParams" prop - any args from root component to contextMenuItems
*/

import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import { Popover } from 'material-ui';
import { List } from 'material-ui/List';

const styles = {
  innerDivStyle: {
    paddingBottom: 0,
    paddingTop: 0,
    lineHeight: 32,
    fontSize: '0.8em',
    width: 220,
  },
  item: {
    root: {
      height: 32,
      overflowX: 'hidden',
    },
    innerDiv: {
      lineHeight: '32px',
      paddingLeft: 40,
      paddingRight: 4,
      paddingTop: 0,
      paddingBottom: 0,
    },
    nestedList: {
      paddingBottom: 0,
      paddingTop: 0,
      lineHeight: 32,
      fontSize: '0.8em',
      width: 220,
    },
    nestedInnerDiv: {
      lineHeight: '32px',
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 0,
      paddingBottom: 0,
      marginLeft: 0,
    },
    icon: {
      margin: 7,
      width: 18,
      height: 18,
    },
    input: {
      width: '100%',
    },
    toggle: {
      width: 32,
      height: 32,
      padding: 0,
      top: 0,
      right: 16,
    },
  },
};

class ContextMenu extends React.Component {
  constructor(props) {
    super(props);
    this.closeContextMenu = this.closeContextMenu.bind(this);
    this.openContextMenu = this.openContextMenu.bind(this);
    this.state = { open: false };
  }

  closeContextMenu() {
    this.setState({ open: false });
  }

  openContextMenu(e) {
    e.preventDefault();
    this.setState({ open: true, anchorEl: e.currentTarget });
  }

  render() {
    const { itemsParams, contextMenuItems = [], children } = this.props;
    return (
      <div onContextMenu={this.openContextMenu}>
        {children}
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.closeContextMenu}
          style={styles.popover}
        >
          <List style={styles.innerDivStyle}>
            {!!contextMenuItems.length && contextMenuItems.map(Item => (
              <Item
                itemsParams={itemsParams}
                menuParams={{ closeContextMenu: this.closeContextMenu, styles: styles.item }}
                key={_.uniqueId()}
              />
            ))}
          </List>
        </Popover>
      </div>
    );
  }
}

ContextMenu.propTypes = {
  itemsParams: PropTypes.object,
  contextMenuItems: PropTypes.array,
  children: PropTypes.object,
};

export default ContextMenu;
