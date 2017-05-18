import { cutOff } from '../utils';

const getGroupBy = (query, select) => {
  let groupBy = query.match(/^\s*group by\s+([\w([\])"'`*:&;.,/\s]+)/im);
  if (groupBy) {
    // todo  refactor
    groupBy = groupBy[1].replace(cutOff, '')
      .replace(/\s/g, '');

    return select.reduce((previous, field, i) => {
      if (~groupBy.indexOf(field.expression)) previous.push(i);
      return previous;
    }, []);
  }
  return null;
};

export { getGroupBy };
