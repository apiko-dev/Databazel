import React, { PropTypes } from 'react';
import PreviewToolbar from '../../containers/preview/preview_toolbar';
import DataVisualisation from '../../containers/preview/data_visualisation';
import ChartSidebar from '../../containers/preview/chart_sidebar';
import Paper from 'material-ui/Paper';
import { Card } from 'material-ui/Card';
import { _ } from 'meteor/underscore';
import { grey300 } from 'material-ui/styles/colors';

class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isQueryChanged: false,
      isLive: true,
    };
    this.toggleRenderState = this.toggleRenderState.bind(this);
    this.getCurrentData = this.getCurrentData.bind(this);
  }

  componentWillReceiveProps({
      viewObject, queryObject, toggleStartConstructor, checkChangingQuery,
    }) {
    this.setState({
      isQueryChanged: checkChangingQuery(this.props.viewObject.query, viewObject.query),
    });
    toggleStartConstructor(_.isEmpty(queryObject.fields));
  }

  getCurrentData() {
    if (!this || !this.refs || !this.refs.dataVisualisationCont) return null;
    const dataVisualCont = this.refs.dataVisualisationCont;
    const dataVisualisation = dataVisualCont.refs.dataVisualisation.getWrappedInstance();
    const { data, queryObject, viewObject } = dataVisualisation.props;
    viewObject.data = data;
    return { queryObject, viewObject };
  }

  toggleRenderState() {
    this.setState({ isLive: !this.state.isLive });
  }

  render() {
    const { savedQuery, queryObject, viewObject, tableType } = this.props;
    const { isQueryChanged, isLive } = this.state;
    const isFields = !_.isEmpty(queryObject.fields);
    return (
      <div
        className="preview-wrap"
        style={isFields ? { height: 'inherit' } : { float: 'right' }}
      >
        <Card className="preview">
          {isFields ?
            <div>
              {tableType === 'simple' ?
                <PreviewToolbar fields={queryObject.fields} />
              : ''}
              <DataVisualisation
                tableType={tableType}
                queryObject={queryObject}
                viewObject={viewObject}
                savedQuery={savedQuery}
                isQueryChanged={isQueryChanged}
                isLive={isLive}
                ref="dataVisualisationCont"
              />
            </div>
          : ''}
        </Card>
        <Paper style={{ backgroundColor: grey300 }} className="chart-sidebar-container">
          <ChartSidebar
            isLive={isLive}
            chartType={viewObject.chartType}
            toggleRenderState={this.toggleRenderState}
            query={viewObject.query}
            getCurrentData={this.getCurrentData}
          />
        </Paper>
      </div>
    );
  }
}

Preview.propTypes = {
  tableType: PropTypes.string,
  savedQuery: PropTypes.string,
  viewObject: PropTypes.object,
  queryObject: PropTypes.object,
};

export default Preview;
