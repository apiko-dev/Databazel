import { cutOff } from '../utils';

const parseFiltering = str => {
  const filters = [];
  const andOr = str.match(/\s+(and|or)\s+/gi);
  if (andOr) {
    let rest = str.slice();
    andOr.forEach(item => {
      const part = rest.slice(0, rest.indexOf(item));
      filters.push(part);
      rest = rest.slice(rest.indexOf(item) + item.length);
    });
    filters.push(rest);
  } else {
    filters.push(str);
  }
  return filters.map((filter, i) => {
    const obj = { operator: filter.match(/(=|<>|<|>|\slike\s)/i)[1] };
    const regex = new RegExp(`${obj.operator}([\\w([\\])"'\`.,/\\s]+)`, 'i');
    obj.exp2 = filter.match(regex)[1];
    obj.exp1 = filter.replace(obj.operator, '').replace(obj.exp2, '').replace(/\s/g, '');
    obj.operator = obj.operator.replace(/\s/g, '');
    obj.exp2 = obj.exp2.replace(/^\s+|\s+$/g, '');
    if (andOr && i < andOr.length) obj.join = andOr[i].replace(/\s/g, '');
    return obj;
  });
};

const getWhere = query => {
  let where = query.match(/\swhere\s+([\w([\])"'`.,/=<>\s]+$)/im);
  if (where) {
    // todo refactor
    where = where[1].replace(cutOff, '');
    const parsed = parseFiltering(where);
    // todo refactor
    parsed.forEach((item) => {
      item.exp2 = item.exp2.replace(/^["]/i, '').replace(/["]$/i, '');
    });
    return parsed;
  }
  return null;
};

export { getWhere };
