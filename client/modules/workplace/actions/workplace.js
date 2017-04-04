import { _ } from 'meteor/underscore';

export default {
  loadCollections({ Meteor, Notificator }, database, callback) {
    const path = `/${database.mount}/${database.name}/`;
    Meteor.call('quasar.getMetadata', path, (err, data) => {
      if (err) Notificator.important(err.reason, 'Error');
      callback(data);
    });
  },

  extendFieldData({ LocalState }, initData, tableType, modelPart) {
    const { fields } = LocalState.get('SQL_QUERY_OBJECT') || {};
    const isGroupingPivot = tableType === 'pivot' && _.contains(['columns', 'rows'], modelPart);
    const pivotGrouping = initData.type === 'date' ? 'day' : true;
    const isRepeated = _.some(fields, field => field.name === initData.name);
    let id = fields && fields.length ? _.last(fields).id : 0;

    const isPivotValues = tableType === 'pivot' && modelPart === 'values';
    let expression;
    if (isPivotValues) expression = `COUNT(${initData.expression})`;
    else expression = initData.expression;
    if (initData.name === '_id') initData.name = 'id';
    if (isPivotValues) initData.type = 'number';
    const addData = {
      name: isRepeated ? `${initData.name}${++id}` : `${initData.name}`,
      grouping: isGroupingPivot ? pivotGrouping : false,
      sort: false,
      currentType: initData.type,
      id: ++id,
      expression,
    };
    if (tableType === 'pivot' && _.contains(['string', 'number'], initData.type)) {
      addData.filters = [{ operator: '<> null' }];
    }
    if (initData.type === 'number') addData.numberTemplate = '.##';
    return _.extend(initData, addData);
  },

  /* drillDown({ LocalState, FlowRouter }, { row, choosenField, queryObject }) {
    if (!!~choosenField.expression.search(/count|sum|avg/i)) {
      const newFields = queryObject.fields
        .filter(field => field.grouping)
        .map(field => {
          field.grouping = false;
          field.filters = [{ operator: '=', value: row[field.name] }];
          return field;
        });
      newFields.push(_.extend(choosenField, {
        expression: choosenField.path,
        name: choosenField.key,
      }));
      queryObject.fields = newFields;
      FlowRouter.go('/workplace');
      LocalState.set('SQL_QUERY_OBJECT', queryObject);
      LocalState.set('CURRENT_SQL_QUERY', null);
    }
  },*/
};

