import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ShowChart from 'material-ui/svg-icons/editor/show-chart';
import { grey400 } from 'material-ui/styles/colors';

class ShareCharts extends React.Component {
  constructor(props) {
    super(props);
    const openMenu = false;
    this.state = { openMenu };
    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleOnRequestChange = this.handleOnRequestChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(event, value) {
    const { userId, selectedCharts, shareCharts } = this.props;
    if (value[0] !== 'no_chart_yet') {
      shareCharts({ userId, selectedCharts, currentCharts: value });
    }
  }
  handleOpenMenu() {
    this.setState({ openMenu: true });
  }
  handleOnRequestChange(value) {
    this.setState({ openMenu: value });
  }
  render() {
    const { defaultCharts, charts } = this.props;
    return (
      <IconMenu
        iconButtonElement={
          <IconButton
            tooltip={i18n.__('share_charts')}
            tooltipPosition="top-center"
          >
            <ShowChart color={grey400} />
          </IconButton>}
        open={this.state.openMenu}
        onRequestChange={this.handleOnRequestChange}
        multiple
        onChange={this.handleChange}
        value={defaultCharts}
      >
        {charts && charts.length ?
          charts.map(chart =>
            <MenuItem key={chart._id} value={chart._id} primaryText={chart.chartName} />
          ) :
          <MenuItem
            key="no_chart_yet"
            value="no_chart_yet"
            primaryText={i18n.__('no_chart_yet')}
          />
        }
      </IconMenu>
    );
  }
}

ShareCharts.propTypes = {
  selectedCharts: PropTypes.array,
  defaultCharts: PropTypes.array,
  charts: PropTypes.array,
  userId: PropTypes.string,
  shareCharts: PropTypes.func.isRequired,
};

export default ShareCharts;
