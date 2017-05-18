import { cutOff } from '../utils';

const getOrderBy = (query, select) => {
  let orderBy = query.match(/\sorder by\s+([\w([\])"'`.,/=<>\s]+$)/i);
  if (orderBy) {
    // todo reactor
    orderBy = orderBy[1].replace(cutOff, '');
    return select.reduce((previous, field, index) => {
      if (~orderBy.indexOf(field.name)) {
        const obj = { index };
        const regex = new RegExp(`${field.name}\\s+(asc|desc)(\\s|,|$)`, 'i');
        const match = orderBy.match(regex);
        if (match) obj.type = match[1].toLowerCase();
        previous.push(obj);
      }
      return previous;
    }, []);
  }
  return null;
};

export { getOrderBy };
