import React, { PropTypes } from 'react';
import Preview from '../containers/preview/preview';
import StartConstructor from './constructors/start_constructor.jsx';
import WorkplaceSidebar from './sidebar/workplace_sidebar.jsx';
import ToggleSidebarStateTab from './sidebar/toggle_sidebar_state_tab.jsx';

class Workplace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollectionFields: false,
      isStartConstructor: !props.isSavedChart,
      tableType: props.tableType || 'simple',
      isClosedDataSidebar: false,
    };
    this.toggleStartConstructor = this.toggleStartConstructor.bind(this);
    this.toggleSidebarState = this.toggleSidebarState.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
    this.changeTableType = this.changeTableType.bind(this);
  }
  componentWillMount() {
    document.body.classList.add('none-scroll-bar');
  }
  componentWillUnmount() {
    this.props.setSQLQueryObj({}, this.state.tableType);
    document.body.classList.remove('none-scroll-bar');
  }
  toggleStartConstructor(newState) {
    if (this.state.isStartConstructor !== newState) {
      this.setState({ isStartConstructor: newState });
    }
  }
  toggleSidebarState() {
    this.setState({ isClosedDataSidebar: !this.state.isClosedDataSidebar });
  }
  togglePreview(isFields) {
    const state = { isCollectionFields: isFields };
    if (!isFields) state.isStartConstructor = true;
    this.setState(state);
  }
  changeTableType(newType) {
    if (newType === 'simple') {
      this.props.updateSQLQueryObj({ pagination: { limit: 50, page: 1 } });
    }
    this.setState({ tableType: newType });
  }
  render() {
    const { chartType, savedQuery, isSavedChart } = this.props;
    const { isCollectionFields, isStartConstructor, tableType, isClosedDataSidebar } = this.state;
    return (
      <div className={isClosedDataSidebar ? 'row workplace close' : 'row workplace'}>
        {isClosedDataSidebar ?
          <ToggleSidebarStateTab
            isOpened={!isClosedDataSidebar}
            onTouchTap={this.toggleSidebarState}
          />
        : ''}
        <div className="col-xs-12 col-sm-12 col-md-4 col-lg-3 data-sidebar-wrap">
          <WorkplaceSidebar
            isClosedDataSidebar={isClosedDataSidebar}
            isCollectionFields={isCollectionFields}
            isSavedChart={isSavedChart}
            tableType={tableType}
            chartType={chartType}
            toggleSidebarState={this.toggleSidebarState}
            togglePreview={this.togglePreview}
          />
        </div>

        {isSavedChart || isCollectionFields ?
          <div className="col-xs-12 col-sm-12 col-md-8 col-lg-9 data-view">
            {isStartConstructor ?
              <StartConstructor
                tableType={tableType}
                changeTableType={this.changeTableType}
              />
            : ''}

            <Preview
              tableType={tableType}
              toggleStartConstructor={this.toggleStartConstructor}
              savedQuery={savedQuery}
            />
          </div>
        : ''}
      </div>
    );
  }
}

Workplace.propTypes = {
  tableType: PropTypes.string,
  chartType: PropTypes.string,
  savedQuery: PropTypes.string,
  isSavedChart: PropTypes.bool,
  updateSQLQueryObj: PropTypes.func,
  setSQLQueryObj: PropTypes.func,
};

export default Workplace;
