import { _ } from 'meteor/underscore';
import { convertTypesRules } from '/lib/constants';

export default {
  getAvailableCollectionFields({ Meteor, LocalState, Notificator }, collections, callback) {
    const database = LocalState.get('CURRENT_DATABASE');
    if (database) getFields({ Meteor, LocalState, Notificator }, [], database, collections, callback);
    else callback(true);
  },
  processFieldsData(context, data) {
    _.forEach(data, (collection, collectionName) => {
      if (!!~collectionName.search(/\s|-/)) {
        const newCollectionName = collectionName.replace(/\s|-/gi, '_');
        data[newCollectionName] = collection;
        delete data[collectionName];
      }
    });
    return processData(data);
  },
  updateFieldType({ LocalState }, field) {
    if (field) {
      const values = LocalState.get('TOOLBAR_VALUES');
      const value = values && values[field.name];
      const type = getItemType(value);

      if (type && !field.isTypeChanged) {
        field.type = type;
        field.currentType = type;
      }
    }
    return field;
  },
};

// TODO Serhii: refactoring
function getFields({ Meteor, LocalState, Notificator }, collectionsData, database, collectionsName, callback) {
  const collectionName = collectionsName[0];
  collectionsName.shift();
  const query = `SELECT _id, * FROM \`${database.name}/${collectionName}\``;

  Meteor.call('quasar.getData', database, `${query} LIMIT 50`, null, (err, res) => {
    if (err) return Notificator.important(err.reason, 'ERROR');
    const data = res.data;

    const countQuery = `SELECT COUNT(*) FROM \`${database.name}/${collectionName}\``;
    Meteor.call('quasar.getData', database, countQuery, null, (err2, res2) => {
      if (err2) return Notificator.important(err2.reason, 'ERROR');
      const count = res2.data[0][0];

      const offset = count < 100 ? '' : `OFFSET ${count - 50}`;
      Meteor.call('quasar.getData', database, `${query} ${offset}`, null, (err3, res3) => {
        if (err3) return Notificator.important(err3.reason, 'ERROR');

        const schema = getSchema(data.concat(res3.data));
        const collection = {
          [collectionName]: schema.value,
        };
        collectionsData.push(collection);

        if (collectionsName.length) {
          getFields({ Meteor, LocalState }, collectionsData, database, collectionsName, callback);
        } else {
          LocalState.set('COLLECTION_FIELDS', collectionsData);
          callback(null, collectionsData);
        }
      });
    });
  });
}

function processData(data, oldExpression, preItemType) {
  return _.map(data, (prop, key) => {
    const type = getItemType(prop);
    const expression = getPath(oldExpression, key, preItemType);
    let nestedData;
    let allowedTypes;
    if (type === 'object' || type === 'array') {
      nestedData = processData(type === 'array' ? [prop[0]] : prop, expression, type);
    } else {
      allowedTypes = checkConverting(prop, type);
    }
    return {
      name: preItemType === 'array' ? 'n' : key,
      nestedData, type, expression, allowedTypes,
    };
  });
}

function getItemType(value) {
  if (_.isNumber(value)) return 'number';
  if (_.isDate(value)) return 'date';
  if (isDate(value)) return 'date';
  if (_.isString(value)) return 'string';
  if (_.isBoolean(value)) return 'boolean';
  if (_.isArray(value)) return 'array';
  if (_.isObject(value)) return 'object';
  return null;
}

function checkConverting(value, type) {
  const types = convertTypesRules[type];
  if (type === 'string') {
    if (+value) types.push('number');
    if (value === 'true' || value === 'false') types.push('boolean');
    if (Date.parse(value)) types.push('date');
  }
  return types;
}

function getPath(oldPath, key, preItemType) {
  let path = key;
  if (oldPath) {
    if (preItemType !== 'array') {
      const parsedKey = !!~key.indexOf(' ') ? `\`${key}\`` : key;
      path = `${oldPath}.${parsedKey}`;
    } else path = `${oldPath}[*]`;
  }
  return path;
}

function isDate(value) {
  const dateObj = new Date(value);
  return dateObj.toString() !== 'Invalid Date' &&
    dateObj.toISOString().replace('.000', '') === value;
}

function getSchema(rows) {
  const schema = {};
  rows.forEach(row => {
    getSchemaLevel(schema, row);
  });
  return schema;
}

function getSchemaLevel(schema, object) {
  _.forEach(object, (prop, key) => {
    if (!_.isObject(schema)) return;
    const isPropObject = _.isObject(prop);
    const isUndefined = _.isUndefined(schema[key]);
    if (!isUndefined && !isPropObject) return;
    if (isUndefined) schema[key] = prop;

    if (isPropObject) {
      getSchemaLevel(schema[key], prop);
    }
  });
}
