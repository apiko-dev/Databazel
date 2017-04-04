import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import Formsy from 'formsy-react';
import { FlatButton, Dialog, IconButton } from 'material-ui';
import FormsyTextInput from '/client/single_components/form_fields/formsy_text_input';
import MultiSelect from '/client/single_components/form_fields/formsy_multi_select.jsx';
import SaveIcon from '/client/single_components/chart_icons/SaveIcon.jsx';
import SaveAsIcon from '/client/single_components/chart_icons/SaveAsIcon.jsx';
import { grey500 } from 'material-ui/styles/colors';

const style = {
  saveChartButton: {
    margin: '6px',
  },
  chartNameSaveAs: {
    width: '100%',
  },
  saveButton: {
    padding: 15,
    display: 'block',
    fill: 'rgb(66, 66, 66)',
  },
  saveAsButton: {
    padding: 12,
    paddingLeft: 15,
    paddingRight: 9,
    display: 'block',
    color: 'rgb(66, 66, 66)',
    fill: 'currentcolor',
  },
  dialog: {
    width: '400px',
  },
  selectDashboards: {
    button: {
      width: '100%',
      backgroundColor: '#80deea',
      hoverColor: '#000',
    },
    menu: {
      width: '336px',
      marginLeft: '16px',
      padding: '8px 16px 8px 0px',
    },
  },
};

class SaveChartForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, canSubmit: true };
    this.saveAsChart = this.saveAsChart.bind(this);
    this.saveChart = this.saveChart.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.callSubmit = this.callSubmit.bind(this);
  }
  saveChart() {
    const { chart, getCurrentData, saveChart } = this.props;
    saveChart(_.extend(chart, getCurrentData()));
  }
  saveAsChart({ chartName, selectedDashboards }) {
    const { chart, saveChart, meteorMethodCall, getCurrentData } = this.props;
    saveChart(_.extend(chart, getCurrentData(), { chartName }), true, res => {
      const chartId = res || chart._id;
      meteorMethodCall('dashboard.addChartToDashboard', {chartId, dashboardId: selectedDashboards});
    });
    this.setState({ open: false });
  }
  callSubmit() {
    this.refs.saveChartForm.submit();
  }
  handleOpen() {
    this.setState({ open: true });
  }
  handleClose() {
    this.setState({ open: false });
  }
  renderAction() {
    return [
      <FlatButton
        label="Cancel"
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label={i18n.__('save')}
        style={style.saveChartButton}
        onTouchTap={this.callSubmit}
        primary
      />,
    ];
  }

  render() {
    const { chart, selectedDashboards, dashboards } = this.props;
    const isModified = chart && chart.isModified;
    const isOverload = chart && chart.isOverload;
    return (
      <span>
        <IconButton
          tooltip={i18n.__('save')}
          style={_.extend(_.clone(style.saveButton), !isModified ? { fill: grey500 } : {})}
          disabled={!isModified || isOverload}
          onTouchTap={chart && chart._id ? this.saveChart : this.handleOpen}
          children={<SaveIcon />}
        />
        {chart && chart._id &&
          <IconButton
            tooltip={i18n.__('save_as')}
            style={style.saveAsButton}
            onTouchTap={this.handleOpen}
            children={<SaveAsIcon />}
            disabled={isOverload}
          />}
        <Dialog
          title={i18n.__('save')}
          actions={this.renderAction()}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          contentStyle={style.dialog}
        >
          <Formsy.Form
            onValidSubmit={this.saveAsChart}
            onInvalidSubmit={() => this.setState({ canSubmit: false })}
            onValid={() => this.setState({ canSubmit: true })}
            className="preview-saveForm"
            ref="saveChartForm"
          >
            <FormsyTextInput
              name="chartName"
              style={style.chartNameSaveAs}
              hintText={i18n.__('chart_name')}
              floatingLabelText={i18n.__('chart_name')}
              // floatingLabelFixed
              value={chart && chart.chartName}
              required
              validations="minLength:1"
              validationError={i18n.__('this_field_is_required')}
            />
            <MultiSelect
              name="selectedDashboards"
              options={dashboards}
              label={i18n.__('dashboards')}
              value={selectedDashboards}
              style={style.selectDashboards}
            />
          </Formsy.Form>
        </Dialog>
      </span>
    );
  }
}

SaveChartForm.propTypes = {
  viewObject: PropTypes.object,
  queryObject: PropTypes.object,
  chart: PropTypes.object,
  dashboards: PropTypes.array,
  selectedDashboards: PropTypes.array,
  saveChart: PropTypes.func,
  meteorMethodCall: PropTypes.func,
  getCurrentData: PropTypes.func,
};

export default SaveChartForm;
