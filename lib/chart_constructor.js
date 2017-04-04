import { chartTypeRules } from '/lib/constants.js';
import { _ } from 'meteor/underscore';

export default {
  canAddFieldToChart(allFields, chartType, constructorType) {
    if (!chartType || !allFields) return true;
    const fields = allFields.filter(field => field.constructorType === constructorType);
    let rule = 1;
    if (!isMoreOneDimensions(allFields, constructorType)) {
      rule = chartTypeRules[chartType][constructorType];
    }
    return fields.length < rule;
  },

  getConstructorFields(allFields, chartType, constructorType) {
    if (!allFields) return [];
    const fields = allFields.filter(field => field.constructorType === constructorType);
    if (!chartType) return fields;
    let rule = 1;
    if (!isMoreOneDimensions(allFields, constructorType)) {
      rule = chartTypeRules[chartType][constructorType];
    }
    return fields.slice(0, rule);
  },

  getChartFields(allFields, chartType) {
    if (!allFields) return [];
    if (!chartType) return allFields;
    const rules = chartTypeRules[chartType];
    const constructorTypes = _.keys(rules);
    const fields = constructorTypes.map((type) => {
      const constructorFields = allFields.filter(field => field.constructorType === type);
      const rule = isMoreOneDimensions(allFields, type) ? 1 : rules[type];
      return constructorFields.slice(0, rule);
    });
    return fields[0].concat(fields[1]);
  },
};

function isMoreOneDimensions(allFields, constructorType) {
  if (constructorType === 'measures') {
    const dimensions = allFields.filter(field => field.constructorType === 'dimensions');
    return dimensions.length > 1;
  }
  return false;
}
