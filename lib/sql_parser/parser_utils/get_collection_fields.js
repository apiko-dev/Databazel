import { _ } from 'meteor/underscore';
import { getType } from '../utils';

const getCollectionFields = (query, fields) => {
  const collectionFields = {};
  if (query.where) {
    // todo refactor
    query.where.forEach(item => {
      const expression = item.exp1;

      if (!collectionFields[expression]) {
        collectionFields[expression] = {
          filters: [],
          name: _.last(expression.split('.')),
          constructorType: 'filters',
          type: getType(expression, fields[0]),
          expression,
        };
        collectionFields[expression].filters = [];
      }

      collectionFields[expression].filters.push({
        value: item.exp2,
        joinOperator: item.join,
        operator: item.operator,
      });
    });
  }
  return collectionFields;
};

export { getCollectionFields };
