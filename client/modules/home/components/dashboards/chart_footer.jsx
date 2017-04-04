import React, { PropTypes } from 'react';
import moment from 'moment';
import i18n from 'meteor/universe:i18n';
import Toggle from 'material-ui/Toggle';

const styles = {
  toggle: {
    width: 'auto',
    display: 'inline-block',
    marginRight: '10px',
  },
};

class ChartFooter extends React.Component {
  constructor(props) {
    super(props);
    this.handleChartAutorefresh = this.handleChartAutorefresh.bind(this);
  }
  handleChartAutorefresh(e) {
    this.props.meteorMethodCall('chart.handleChartAutorefresh', {
      chartId: this.props.chart._id,
      autorefresh: e.currentTarget.checked,
    });
  }
  render() {
    const { viewObject: { dataTimeStamp }, autorefresh } = this.props.chart;
    return (
      <div className="footer">
        <Toggle
          style={styles.toggle}
          label={i18n.__('autorefresh')}
          defaultToggled={autorefresh}
          onToggle={this.handleChartAutorefresh}
        />
        {dataTimeStamp && `${i18n.__('refreshed')} ${moment(dataTimeStamp).fromNow()}`}
      </div>
    );
  }
}

ChartFooter.propTypes = {
  chart: PropTypes.object.isRequired,
  meteorMethodCall: PropTypes.func.isRequired,
};

export default ChartFooter;
