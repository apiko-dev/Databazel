import React, { PropTypes } from 'react';
import Collections from '../../containers/collections_list/collections';
import CollectionFields from '../../containers/collection_fields';
import ToggleSidebarStateTab from './toggle_sidebar_state_tab.jsx';
import Constructor from '../../containers/constructors/constructor';
import ChartConstructor from '../../containers/constructors/chart-constructor';
import Paper from 'material-ui/Paper';
import { grey300 } from 'material-ui/styles/colors';

const styles = {
  dataSidebar: {
    borderRadius: 0,
    backgroundColor: grey300,
  },
};

class WorkplaceSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isCollectionsOpen: !props.isSavedChart };
    this.changeCollectionState = this.changeCollectionState.bind(this);
  }
  changeCollectionState(state) {
    this.setState({ isCollectionsOpen: state });
  }
  render() {
    const { isCollectionFields, tableType, toggleSidebarState,
      togglePreview, isClosedDataSidebar } = this.props;
    return (
      <Paper style={styles.dataSidebar} zDepth={2} className="data-sidebar">
        <ToggleSidebarStateTab
          isOpened={!isClosedDataSidebar}
          onTouchTap={toggleSidebarState}
        />
        <Collections
          isCollectionsOpen={this.state.isCollectionsOpen}
          changeCollectionState={this.changeCollectionState}
          togglePreview={togglePreview}
        />

        {!this.state.isCollectionsOpen ?
          <div className="sidebar-constructor">
            <CollectionFields
              togglePreview={togglePreview}
              prePreviewState={isCollectionFields}
              changeCollectionState={this.changeCollectionState}
            />
            {isCollectionFields && <Constructor tableType={tableType} />}
            {isCollectionFields && <ChartConstructor />}
          </div>
        : ''}
      </Paper>
    );
  }
}

WorkplaceSidebar.propTypes = {
  isClosedDataSidebar: PropTypes.bool,
  isCollectionFields: PropTypes.bool,
  isSavedChart: PropTypes.bool,
  tableType: PropTypes.string,
  toggleSidebarState: PropTypes.func,
  togglePreview: PropTypes.func,
};

export default WorkplaceSidebar;
