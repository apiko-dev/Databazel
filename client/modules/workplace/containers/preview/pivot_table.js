import React from 'react';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import PivotTable from '/client/modules/workplace/components/pivotview/pivot_table.jsx';
import dataProcessing from '/lib/data_processing';
import { pivotCellsLimit } from '/lib/constants';

export const composer = ({ chart: { viewObject, queryObject, data }, context }, onData) => {
  if (data.length === pivotCellsLimit) {
    const { Notificator } = context();
    Notificator.important(
      i18n.__('pivot_cells_limit_is_reached'),
      i18n.__('too_much_data')
    );
  } else {
    const { fields } = queryObject;
    const { pivot: { model, sorting } } = viewObject;
    const { rows = [], columns = [], values = [] } = model;
    const pivotModelExt = {
      rowsNames: rows.map(fieldId => _.find(fields, f => f.id === fieldId).name),
      colsNames: columns.map(fieldId => _.find(fields, f => f.id === fieldId).name),
      valuesExp: values.map(fieldId => _.find(fields, f => f.id === fieldId).expression),
    };
    const pivotColsHeaders = dataProcessing.createPivotColsHeaders(data, fields, model);
    const pivotData = dataProcessing.createPivotData(
      { data, fields, model, sorting, pivotColsHeaders }
    );
    onData(null, { pivotModelExt, viewObject, pivotData, pivotColsHeaders, fields });
  }
};

export const depsMapper = (context, actions) => ({
  updateSorting: actions.pivot.updateSorting,
  sortData: actions.pivot.sortData,
  addTotals: actions.pivot.addTotals,
  aggregate: actions.pivot.aggregate,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer, () => <i />),
  useDeps(depsMapper)
)(PivotTable);

