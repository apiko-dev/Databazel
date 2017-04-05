import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import i18n from 'meteor/universe:i18n';
import DataVisualisation from '../../components/preview/data_visualisation.jsx';

const formatQueries = (query) => {
  const reg = /\.(.[^.]*:+.*)\./g;
  return query.replace(reg, (result, $1) => '.`' + $1 + '`.');
};

export const composer = ({
  queryObject, viewObject, isLive, isQueryChanged, getQuasarData, savedQuery, context,
  }, onData) => {
  const { Notificator } = context();
  if (!viewObject.query) return onData(null, {});
  if (viewObject.data && !isQueryChanged && viewObject.query === savedQuery) {
    return onData(null, { data: viewObject.data });
  }

  if (isLive && isQueryChanged) {
    const formattedQuery = formatQueries(viewObject.query);
    getQuasarData(queryObject.fields, formattedQuery, false, ({ error, data = [] }) => {
      if (error) Notificator.snackbar(i18n.__('bad_request'), 'negative');
      onData(null, { data });
    });
  }
  if (!isLive) return onData(null, {});
  if (isQueryChanged) {
    onData(null, { isLoading: true });
  }
  return null;
};

export const depsMapper = (context, actions) => ({
  updateToolbarValues: actions.workplaceState.updateToolbarValues,
  updateSQLQueryObj: actions.workplaceState.updateSQLQueryObj,
  getQuasarData: actions.preview.getQuasarData,
  resetData: actions.workplaceState.resetData,
  processDateField: actions.preview.processDateField,
  createDataMap: actions.pivot.createDataMap,
  createColumnsMap: actions.pivot.createColumnsMap,
  ref: 'dataVisualisation',
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer, null, null, { withRef: true }),
  useDeps(depsMapper)
)(DataVisualisation);
