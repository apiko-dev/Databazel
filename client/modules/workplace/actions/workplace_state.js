import { _ } from 'meteor/underscore';
import { pivotCellsLimit } from '/lib/constants';
import SQLParser from '/lib/sql_parser';

export default {
  setSQLQuery({ LocalState }, query) {
    const fields = LocalState.get('COLLECTION_FIELDS');
    const oldQueryObj = LocalState.get('SQL_QUERY_OBJECT');
    const queryObj = SQLParser.parseToQueryObject(query, fields);
    queryObj.from = oldQueryObj.from;
    queryObj.on = oldQueryObj.on;
    LocalState.set('SQL_QUERY_OBJECT', queryObj);
  },

  setSQLQueryObj({ LocalState }, queryObj, tableType) {
    const queryObject = queryObj || {};
    if (!queryObject.pagination) {
      queryObject.pagination = { limit: tableType === 'pivot' ? pivotCellsLimit : 50, page: 1 };
    }
    LocalState.set('SQL_QUERY_OBJECT', queryObject);
    LocalState.set('VIEW_OBJECT', null);
  },

  getSQLQueryObj({ LocalState }, ...keys) {
    const queryObj = LocalState.get('SQL_QUERY_OBJECT');
    if (!queryObj) return null;
    return keys && keys.length ? _.pick(queryObj, keys) : queryObj;
  },

  updateSQLQueryObj({ LocalState }, newProps) {
    const queryObj = LocalState.get('SQL_QUERY_OBJECT');
    resetData(LocalState);
    LocalState.set('SQL_QUERY_OBJECT', _.extend(queryObj, newProps));
  },

  updateSelectedField({ LocalState }, field) {
    if (!field) return;
    const queryObj = LocalState.get('SQL_QUERY_OBJECT');
    const fields = queryObj.fields;
    let index;

    resetData(LocalState);
    _.map(fields, (currentField, i) => {
      if (currentField.id === field.id) index = i;
    });
    fields.splice(index, 1, field);
    LocalState.set('SQL_QUERY_OBJECT', _.extend(queryObj, { fields }));
  },

  resetData({ LocalState }) {
    resetData(LocalState);
  },

  addFieldToQueryObj({ LocalState }, field, tableType) {
    if (!field) return;
    const queryObj = LocalState.get('SQL_QUERY_OBJECT');
    const fields = queryObj.fields || [];
    if (tableType === 'pivot') queryObj.pagination.limit = pivotCellsLimit;
    queryObj.pagination.page = 1;
    fields.push(field);
    LocalState.set('SQL_QUERY_OBJECT', _.extend(queryObj, { fields }));
  },

  updateCollectionField({ LocalState }, fieldData) {
    const queryObj = LocalState.get('SQL_QUERY_OBJECT');
    const collectionFields = queryObj.collectionFields || {};
    const field = collectionFields[fieldData.expression];

    collectionFields[fieldData.expression] = _.extend(field || {}, fieldData);
    queryObj.collectionFields = collectionFields;
    LocalState.set('SQL_QUERY_OBJECT', queryObj);
  },

  addCollectionField({ LocalState }, field) {
    const queryObj = LocalState.get('SQL_QUERY_OBJECT');
    const collectionFields = queryObj.collectionFields || {};

    collectionFields[field.expression] = field;
    LocalState.set('SQL_QUERY_OBJECT', _.extend(queryObj, { collectionFields }));
  },

  deleteField({ LocalState }, fieldId) {
    const queryObj = LocalState.get('SQL_QUERY_OBJECT');
    queryObj.fields.splice(_.indexOf(_.map(queryObj.fields, (f) => f.id), fieldId), 1);
    LocalState.set('SQL_QUERY_OBJECT', queryObj);
  },

  updateToolbarState({ LocalState }, fieldId) {
    LocalState.set('TOOLBAR_STATE', fieldId);
  },

  updateToolbarValues({ LocalState }, values) {
    const preValues = LocalState.get('TOOLBAR_VALUES');
    if (!_.isEqual(preValues, values)) {
      LocalState.set('TOOLBAR_VALUES', values);
    }
  },

  updateViewObj({ LocalState }, newProps) {
    const viewObj = LocalState.get('VIEW_OBJECT') || {};
    LocalState.set('VIEW_OBJECT', _.extend(viewObj, newProps));
  },
};

function resetData(LocalState) {
  const viewObj = LocalState.get('VIEW_OBJECT');
  if (viewObj && viewObj.data) {
    delete viewObj.data;
    LocalState.set('VIEW_OBJECT', viewObj);
  }
}
