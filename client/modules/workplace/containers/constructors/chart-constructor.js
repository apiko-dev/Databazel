import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import ChartConstructor from '../../components/constructors/chart-constructor.jsx';

export const composer = ({ context, determineDefaultFields, updateSQLQueryObj }, onData) => {
  const { LocalState } = context();
  const viewObj = LocalState.get('VIEW_OBJECT') || {};
  const { chartType, pivot } = viewObj;
  const queryObj = LocalState.get('SQL_QUERY_OBJECT') || {};
  const { fields } = queryObj;
  if (chartType && !fields.filter(f => f.constructorType !== undefined).length) {
    const defaultedFields = determineDefaultFields(fields, chartType, pivot);
    if (defaultedFields) updateSQLQueryObj({ fields: defaultedFields });
  }
  onData(null, { viewObj, queryObj });
};

export const depsMapper = (context, actions) => ({
  context: () => context,
  updateSQLQueryObj: actions.workplaceState.updateSQLQueryObj,
  determineDefaultFields: actions.preview.determineDefaultFields,
  getNewChartModelFields: actions.preview.getNewChartModelFields,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(ChartConstructor);
