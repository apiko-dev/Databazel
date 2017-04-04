import { _ } from 'meteor/underscore';
import i18n from 'meteor/universe:i18n';
import constructorHelpers from '/lib/chart_constructor';
import dataProcessing from '/lib/data_processing.js';
import { chartTypeRules } from '/lib/constants';

export default {
  canAddFieldToChart({ LocalState }, chartType, constructorType) {
    const queryObj = LocalState.get('SQL_QUERY_OBJECT') || {};
    if (constructorHelpers.canAddFieldToChart(queryObj.fields, chartType, constructorType)) {
      return true;
    }
    return console.error('error');
  },

  getConstructorFields(context, fields, chartType, constructorType) {
    if (constructorType) {
      return constructorHelpers.getConstructorFields(fields, chartType, constructorType);
    }
    return constructorHelpers.getChartFields(fields, chartType);
  },

  getFilterFields(context, collectionFields) {
    return _.filter(collectionFields, field => field.constructorType === 'filters');
  },

  checkChangingQuery(context, query, nextQuery) {
    if (query === nextQuery) return false;
    if (!query || !nextQuery) return true;
    const regExp = /SELECT\n\t([\s\S]+)\nFROM\n\t([\s\S]+)/i;
    const parsedQuery = query.match(regExp);
    const parsedNextQuery = nextQuery.match(regExp);
    if (parsedQuery[2] !== parsedNextQuery[2]) return true;
    return !~parsedQuery[1].indexOf(parsedNextQuery[1]);
  },

  getQuasarData({ Meteor, LocalState }, fields, query, isSingleRequest, cb) {
    const requestId = _.uniqueId();
    const database = LocalState.get('CURRENT_DATABASE');
    LocalState.set('QUASAR_REQUEST_ID', requestId);
    Meteor.call('quasar.getData', database, query, requestId,
      (err, { data = [], answerId } = {}) => {
        if (err) cb({ error: true });
        else if (LocalState.get('QUASAR_REQUEST_ID') === answerId || isSingleRequest) {
          const processedData = dataProcessing.process(data, fields);
          cb({ data: processedData });
        }
      }
    );
  },
  determineDefaultFields({ Notificator }, fields, chartType, pivot) {
    let result;
    if (pivot && pivot.model) {
      const measuresId = pivot.model.values;
      let dimensionsCounter = 0;
      fields.forEach(f => {
        if (!~measuresId.indexOf(f.id)) {
          dimensionsCounter++;
          if (dimensionsCounter < 3) f.constructorType = 'dimensions';
        } else {
          f.constructorType = 'measures';
        }
      });
      result = fields;
    } else {
      const getNeededfields = () => {
        const fieldsArray = [];
        _.each(chartTypeRules[chartType], (val, key) => {
          fieldsArray.push({ name: key });
          if (key === 'dimensions' && dataProcessing.couldQueryBeStacked(fields)) {
            fieldsArray.push({ name: 'dimensions' });
          }
        });
        return fieldsArray;
      };
      const neededFields = getNeededfields();
      const findIndex = (needNumber) => {
        let i = -1;
        fields.forEach((f, j) => {
          if ((needNumber ? f.currentType === 'number' : f.currentType !== 'number') &&
            !~neededFields.map(h => h.id).indexOf(f.id) &&
            !f.constructorType
          ) {
            i = j;
          }
        });
        if (!~i && !needNumber) {
          fields.forEach((f, j) => {
            if (!~neededFields.map(h => h.id).indexOf(f.id)) i = j;
          });
        }
        return i;
      };

      neededFields.forEach((f, i) => {
        const isNumberIndex = f.name !== 'dimensions';
        const index = findIndex(isNumberIndex);
        if (!!~index) {
          neededFields[i].id = fields[index].id;
          fields[index].constructorType = f.name;
        } else if (isNumberIndex) Notificator.snackbar(i18n.__('numeric_field_needed'));
      });
      if (neededFields.filter(f => f.id).length) result = fields;
    }
    return result;
  },

  getNewChartModelFields(context, { chartType, fields }, { fieldId, isChecked, label }) {
    const checkedFieldsNumber = fields.filter(f => f.constructorType === label).length;
    const newFields = fields.map(f => _.extend(_.clone(f),
        f.id === fieldId ? { constructorType: isChecked ? label : null } : {})
    );
    const maxCheckedFields = (() => {
      let res = chartTypeRules[chartType][label];
      if (
        /bar|line|radar/i.test(chartType) &&
        !dataProcessing.couldQueryBeStacked(newFields) &&
        label === 'dimensions'
      ) {
        res--;
      }
      return res;
    })();
    if (checkedFieldsNumber + (isChecked ? 1 : -1) > maxCheckedFields) {
      const idToClear = newFields.findIndex(f => f.id !== fieldId && f.constructorType === label);
      newFields[idToClear].constructorType = null;
    }
    return newFields;
  },
};
