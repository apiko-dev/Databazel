import { _ } from 'meteor/underscore';
import dataProcessing from '/lib/data_processing';
import { pivotModelRules } from '/lib/constants';

export default {
  canAddFieldToModelPart({ LocalState }, { fieldPath, label }) {
    const { pivot = {} } = LocalState.get('VIEW_OBJECT') || {};
    const { model = {} } = pivot;
    const queryObject = LocalState.get('SQL_QUERY_OBJECT') || {};
    const { fields = [] } = queryObject;
    const columnsRowsValuesFieldsId = _.union(_.values(model));
    if (model[label] && model[label].length === pivotModelRules[label]) return false;
    return !~getFieldsPathById(columnsRowsValuesFieldsId, fields).indexOf(fieldPath);
  },
  addFieldToModelPart({ LocalState }, { fieldId, modelPart }) {
    const viewObject = LocalState.get('VIEW_OBJECT') || {};
    const model = viewObject.pivot && viewObject.pivot.model || {};
    model[modelPart] = model[modelPart] || [];
    model[modelPart].push(fieldId);
    if (!viewObject.pivot) viewObject.pivot = {};
    viewObject.pivot.model = model;
    viewObject.pivot.sorting = [];
    LocalState.set('VIEW_OBJECT', viewObject);
  },
  removeFieldFromModelPart({ LocalState }, field, modelPart) {
    const viewObject = LocalState.get('VIEW_OBJECT') || {};
    const queryObject = LocalState.get('SQL_QUERY_OBJECT');
    if (modelPart !== 'filters') {
      queryObject.fields.splice(_.indexOf(_.map(queryObject.fields, (f) => f.id), field.id), 1);
      LocalState.set('SQL_QUERY_OBJECT', queryObject);
    }
    if (viewObject.pivot && viewObject.pivot.model) {
      viewObject.pivot.model[modelPart] = _.without(viewObject.pivot.model[modelPart], field.id);
      viewObject.pivot.sorting = [];
      LocalState.set('VIEW_OBJECT', viewObject);
    }
  },
  updateSorting({ LocalState }, column) {
    const col = typeof column === 'object' ?
      _.omit(column, ['colGroup1Value', 'colGroup2Value']) : column;
    const viewObject = LocalState.get('VIEW_OBJECT');
    const { sorting = [] } = viewObject.pivot;
    let indexSame;
    sorting.forEach((sort, i) => {
      if (_.isEqual(sort.col, col) || sort.col === col) indexSame = i;
    });
    if (indexSame + 1) {
      if (sorting[indexSame].order === 'desc') sorting.push({ order: 'asc', col });
      sorting.splice(indexSame, 1);
    } else {
      sorting.push({ order: 'desc', col });
    }
    viewObject.pivot.sorting = sorting;
    LocalState.set('VIEW_OBJECT', viewObject);
  },
  aggregate(context, valuesArr, aggFunc) {
    return dataProcessing.aggregate(valuesArr, aggFunc);
  },
};

function getFieldsPathById(fieldsId, fields = []) {
  return fields.filter(field => !!~fieldsId.indexOf(field.id)).map(field => field.path);
}

