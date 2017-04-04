import React, { PropTypes } from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import TableIcon from 'material-ui/svg-icons/editor/border-all';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import i18n from 'meteor/universe:i18n';

import IconWrapper from '/client/single_components/chart_icons/IconWrapper';
import BarIcon from '/client/single_components/chart_icons/BarIcon';
import LineIcon from '/client/single_components/chart_icons/LineIcon';
import PieIcon from '/client/single_components/chart_icons/PieIcon';
import RadarIcon from '/client/single_components/chart_icons/RadarIcon';
import PolarAreaIcon from '/client/single_components/chart_icons/PolarAreaIcon';
import DoughnutIcon from '/client/single_components/chart_icons/DoughnutIcon';
import ScatterIcon from '/client/single_components/chart_icons/ScatterIcon';


const style = {
  menuItem: {
    padding: '0 20px',
  },
  IconButton: {
    color: 'rgb(66, 66, 66)',
    fill: 'currentcolor',
  },
  chevronLeft: {
    left: '-16px',
  },
};

class ChartTypeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { chartType: props.chartType };
    this.selectChartType = this.selectChartType.bind(this);
    this.currentIcon = this.currentIcon.bind(this);
  }
  selectChartType(e, value) {
    this.setState({ chartType: value });
    this.props.updateViewObj({ chartType: value });
  }
  currentIcon() {
    switch (this.state.chartType) {
      case 'bar': return <BarIcon />;
      case 'line': return <LineIcon />;
      case 'pie': return <PieIcon />;
      case 'polarArea': return <PolarAreaIcon />;
      case 'doughnut': return <DoughnutIcon />;
      case 'radar': return <RadarIcon />;
      case 'scatter': return <ScatterIcon />;
      default: return <TableIcon />;
    }
  }
  render() {
    return (
      <IconMenu
        onChange={this.selectChartType}
        value={this.state.chartType}
        iconButtonElement={
          <IconButton
            tooltip={i18n.__('chart_type')}
            disabled={!this.props.isLive}
            style={style.IconButton}
          >
            {this.currentIcon()}
          </IconButton>
        }
      >
        <MenuItem
          value={null}
          primaryText={<IconWrapper><TableIcon /></IconWrapper>}
          innerDivStyle={style.menuItem}
        />
        <MenuItem
          value="bar"
          primaryText={<IconWrapper tooltip={i18n.__('bar')}><BarIcon /></IconWrapper>}
          innerDivStyle={style.menuItem}
        />
        <MenuItem
          value="line"
          primaryText={<IconWrapper tooltip={i18n.__('line')}><LineIcon /></IconWrapper>}
          innerDivStyle={style.menuItem}
        />
        <MenuItem
          value={this.state.chartType}
          innerDivStyle={style.menuItem}
          leftIcon={<NavigationChevronLeft style={style.chevronLeft} />}
          primaryText={
            <IconWrapper
              tooltip={i18n.__('pie')}
              children={<PieIcon />}
            />
          }
          menuItems={[
            <MenuItem
              innerDivStyle={style.menuItem}
              onTouchTap={e => this.selectChartType(e, 'pie')}
              primaryText={
                <IconWrapper
                  tooltip={i18n.__('pie')}
                  tooltipPosition="bottom-right"
                  children={<PieIcon />}
                />
              }
            />,
            <MenuItem
              innerDivStyle={style.menuItem}
              onTouchTap={e => this.selectChartType(e, 'doughnut')}
              primaryText={
                <IconWrapper tooltip={i18n.__('doughnut')} children={<DoughnutIcon />} />
              }
            />,
            <MenuItem
              innerDivStyle={style.menuItem}
              onTouchTap={e => this.selectChartType(e, 'polarArea')}
              primaryText={<IconWrapper tooltip={i18n.__('polar')} children={<PolarAreaIcon />} />}
            />,
          ]}
        />
        <MenuItem
          value="scatter"
          primaryText={<IconWrapper tooltip={i18n.__('scatter')}><ScatterIcon /></IconWrapper>}
          innerDivStyle={style.menuItem}
        />
        <MenuItem
          value="radar"
          primaryText={<IconWrapper tooltip={i18n.__('radar')}><RadarIcon /></IconWrapper>}
          innerDivStyle={style.menuItem}
        />
      </IconMenu>
    );
  }
}

ChartTypeButton.propTypes = {
  isLive: PropTypes.bool,
  updateViewObj: PropTypes.func,
  changeChartType: PropTypes.func,
  chartType: PropTypes.string,
};

export default ChartTypeButton;
