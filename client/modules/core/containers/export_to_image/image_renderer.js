import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import ImageRender from '../../components/export_to_image/image_renderer';
import dataProcessing from '/lib/data_processing.js';
import i18n from 'meteor/universe:i18n';

export const composer = ({ context, chartsId, setChartsIdToExport, dashboardName }, onData) => {
  const { Meteor, Collections, Notificator } = context();
  if (chartsId && chartsId.length > 0) {
    if (Meteor.subscribe('charts.images', chartsId).ready()) {
      const chartsData = Collections.Charts
        .find({
          _id: { $in: chartsId },
          'viewObject.chartType': { $ne: null },
        })
        .map(chart => dataProcessing.imageProcessData(chart));
      const chartsIdToExport = chartsData.map(chart => chart.chartId);
      if (chartsData.length) {
        const exportName = dashboardName || chartsData[0].chartName;
        setChartsIdToExport({ chartsIdToExport, exportName });
        onData(null, { chartsData });
      } else {
        onData(null, {});
        Notificator.snackbar(i18n.__('no_charts_available_for_export'));
      }
    }
  } else {
    onData(null, {});
    Notificator.snackbar(i18n.__('no_charts_available_for_export'));
  }
};

export const depsMapper = (context, actions) => ({
  context: () => context,
  exportChartBase64: actions.charts.exportChartBase64,
  setChartsIdToExport: actions.charts.setChartsIdToExport,
});

export default composeAll(
  composeWithTracker(composer, () => null),
  useDeps(depsMapper)
)(ImageRender);
