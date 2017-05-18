import { replaceCuttOff } from '../utils';

const parseHavingConditions = (str) => {
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
    const regex = new RegExp(`${obj.operator}([\\w([\\])"'\`*:&;%@.,-/\\s]+)`, 'i');
    obj.exp2 = filter.match(regex)[1];
    obj.exp1 = filter.replace(obj.operator, '').replace(obj.exp2, '').replace(/\s/g, '');
    obj.operator = obj.operator.replace(/\s/g, '');
    obj.exp2 = obj.exp2.replace(/^\s+|\s+$/g, '');
    if (andOr && i < andOr.length) obj.join = andOr[i].replace(/\s/g, '');
    return obj;
  });
};


const getHaving = query => {
  // todo refactor
  const getWordIndex = (line, word, fromPosition = 0) => {
    let result = line.indexOf(word, fromPosition);
    if (result === -1) {
      result = line.indexOf(word.toUpperCase(), fromPosition);
    }
    return result;
  };
  const isCountExist = (queryToCheck) => queryToCheck.match(/COUNT[(]/gi);
  const removebracesWithRegex = (line) => line.replace(/[()]/g, '');
  const removeBraces = (queryPart) => {
    let result = '';
    if (isCountExist(queryPart)) {
      const countWordINdex = getWordIndex(queryPart, 'count(');
      const afterCountIndex = getWordIndex(queryPart, ')', countWordINdex);
      result += removebracesWithRegex(queryPart.substr(0, countWordINdex));
      result += queryPart.substring(countWordINdex, afterCountIndex + 1);
      result += removeBraces(queryPart.substring(afterCountIndex + 1));
    } else {
      result += removebracesWithRegex(queryPart);
    }
    return result;
  };
  const having = query.match(/^\s*having\s+([\w([\])"'`*:&;.,-<>%@=\/\s]+)limit\s/im) || [];
  if (!having.length) return null;

  return having
    .filter((el, i) => i === 1)
    .map(replaceCuttOff)
    .map(removeBraces)
    .map(parseHavingConditions)[0];
};

export { getHaving };
