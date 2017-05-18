import { _ } from 'meteor/underscore';

const cutOff =
  /(\sgroup by\s|\sorder by\s|\swhere\s|\shaving\s|\slimit\s|\soffset\s)+[\w([\])"'`.,/=<>\s]+$/i;

const replaceCuttOff = string => string.replace(cutOff, '');

const getParamName = (queryPartial) => queryPartial.match(/\s+as\s+(\w+)/i);

const parseQueryPartial = (partial, paramName) =>
  partial.slice(0, paramName.index).match(/(\w+)\/(\w+)/i);

const isDate = value => {
  const dateObj = new Date(value);
  return dateObj.toString() !== 'Invalid Date' &&
    dateObj.toISOString().replace('.000', '') === value;
};

const getItemType = value => {
  if (_.isNumber(value)) return 'number';
  if (_.isDate(value)) return 'date';
  if (isDate(value)) return 'date';
  if (_.isString(value)) return 'string';
  if (_.isBoolean(value)) return 'boolean';
  if (_.isArray(value)) return 'array';
  if (_.isObject(value)) return 'object';
  return null;
};

const getType = (expression, fields) => {
  let currentValue = fields;
  const path = expression.split('.');
  // todo refactor
  path.forEach(pathItem => {
    currentValue = currentValue[pathItem];
  });
  return getItemType(currentValue);
};

export {
  cutOff,
  replaceCuttOff,
  getParamName,
  parseQueryPartial,
  getType,
};
