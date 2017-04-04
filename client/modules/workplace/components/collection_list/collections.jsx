import React, { PropTypes } from 'react';
import CollectionList from '../../containers/collections_list/collections_list';

class ComponentName extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { database = {}, isCollectionsOpen } = this.props;
    const { database: nextDatabase = {} } = nextProps;
    const isChangedMount = database.mount !== nextDatabase.mount;
    const isChangedCollectionsState = isCollectionsOpen !== nextProps.isCollectionsOpen;
    return isChangedMount || isChangedCollectionsState;
  }
  render() {
    if (!this.props.database) return null;
    return <CollectionList {...this.props} />;
  }
}

ComponentName.propTypes = {
  isCollectionsOpen: PropTypes.bool,
  database: PropTypes.object,
};

export default ComponentName;
