import { _ } from 'meteor/underscore';

const cutOff =
  /(\sgroup by\s|\sorder by\s|\swhere\s|\shaving\s|\slimit\s|\soffset\s)+[\w([\])"'`.,/=<>\s]+$/i;

export default {
  parse(query) {
    const objectSQL = {
      select: getSelect(query),
      from: getFrom(query),
      having: getHaving(query),
      where: getWhere(query),
      limit: getLimit(query),
      offset: getOffset(query),
      join: getJoin(query),
    };
    objectSQL.groupBy = getGroupBy(query, objectSQL.select);
    objectSQL.orderBy = getOrderBy(query, objectSQL.select);
    return objectSQL;
  },
  parseToQueryObject(rawQuery, fields) {
    const query = this.parse(rawQuery);
    const queryObject = {};
    const having = getHavingObj(query);

    queryObject.pagination = getPagination(query);
    queryObject.fields = getFields(query, having);

    query.groupBy && query.groupBy.forEach(fieldIndex => {
      queryObject.fields[fieldIndex].grouping = true;
    });
    query.orderBy && query.orderBy.forEach(field => {
      queryObject.fields[field.index].sort = field.type;
    });

    queryObject.collectionFields = getCollectionFields(query, fields);

    queryObject.join = query.join;

    return queryObject;
  },
};

function getSelect(query) {
  let select = query.match(/^\s*select\s+([\w([\])"'`.,/\s]+)from\s/i);
  if (!select) return { error: 'Wrong syntax: "SELECT <fields> FROM <collections>" expected' };
  select = select[1];
  const asNames = select.match(/\s+as\s+\w+/ig);
  let names = [];
  let expressions = [];
  if (asNames) {
    names = asNames.map(item => item.replace(/(^\s+as\s|\s)+/ig, ''));
    expressions = [select.slice(0, select.indexOf(asNames[0]))];
    for (let i = 0; i < asNames.length - 1; i++) {
      expressions.push(select.slice(select.indexOf(asNames[i]) + asNames[i].length,
        select.indexOf(asNames[i + 1])));
    }
  } else {
    expressions = select.match(/\w+\.\w+/ig);
    if (expressions) {
      names = expressions.map(exp => exp.match(/\w+\.(\w+)/i)[1]);
    } else {
      return { error: 'Wrong fields!' };
    }
  }
  return names.map((name, i) => ({
    name: names[i],
    expression: expressions[i].replace(/(^,|\s)/g, ''),
  }));
}

const getParamName = (queryPartial) => queryPartial.match(/\s+as\s+(\w+)/i);
const parseQueryPartial = (partial, paramName) =>
  partial.slice(0, paramName.index).match(/(\w+)\/(\w+)/i);

function getFrom(query) {
  const from = query.match(/\sfrom\s+([\w([\])"'`.,/=<>\s]+$)/i)[1].replace(cutOff, '');
  const name = getParamName(from);
  const path = parseQueryPartial(from, name);
  return { db: path[1], collection: path[2], name: name[1] };
}

function getJoin(query) {
  const from = query.match(/\sjoin\s+([\w([\])"'`.,/=<>\s]+$)/i)[1].replace(cutOff, '');
  const name = getParamName(from);
  const path = parseQueryPartial(from, name);
  return path[2];
}

function getGroupBy(query, select) {
  let groupBy = query.match(/\sgroup by\s+([\w([\])"'`.,/=<>\s]+$)/i);
  if (groupBy) {
    groupBy = groupBy[1].replace(cutOff, '')
      .replace(/\s/g, '');
    return select.reduce((previous, field, i) => {
      if (~groupBy.indexOf(field.expression)) previous.push(i);
      return previous;
    }, []);
  }
  return null;
}

function getOrderBy(query, select) {
  let orderBy = query.match(/\sorder by\s+([\w([\])"'`.,/=<>\s]+$)/i);
  if (orderBy) {
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
}

function getHaving(query) {
  let having = query.match(/\shaving\s+([\w([\])"'`.,/=<>\s]+$)/i);
  if (having) {
    having = having[1].replace(cutOff, '');
    return parseFiltering(having);
  }
  return null;
}

function getWhere(query) {
  let where = query.match(/\swhere\s+([\w([\])"'`.,/=<>\s]+$)/i);
  if (where) {
    where = where[1].replace(cutOff, '');
    return parseFiltering(where);
  }
  return null;
}

function getLimit(query) {
  const limit = query.match(/\slimit\s+(\d+)/i);
  if (limit) return +limit[1];
  return null;
}

function getOffset(query) {
  const offset = query.match(/\soffset\s+(\d+)/i);
  if (offset) return +offset[1];
  return null;
}

function parseFiltering(str) {
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
}

function getPagination(query) {
  return {
    limit: query.limit,
    page: query.skip ? query.skip / query.limit : 1,
  };
}

function getHavingObj(query) {
  const having = {};
  if (query.having) {
    query.having.forEach(item => {
      if (!having[item.exp1]) having[item.exp1] = [];
      having[item.exp1].push({
        value: item.exp2,
        joinOperator: item.join,
        operator: item.operator,
      });
    });
  }
  return having;
}

function getFields(query, having) {
  return query.select.map((field, i) => (
    {
      id: i,
      name: field.name,
      expression: field.expression,
      grouping: field.date ? field.date : false,
      sort: false,
      filters: having[field.expression],
    }
  ));
}

function getCollectionFields(query, fields) {
  const collectionFields = {};
  if (query.where) {
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
}

function getType(expression, fields) {
  let currentValue = fields;
  const path = expression.split('.');
  path.forEach(pathItem => {
    currentValue = currentValue[pathItem];
  });
  return getItemType(currentValue);
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

function isDate(value) {
  const dateObj = new Date(value);
  return dateObj.toString() !== 'Invalid Date' &&
    dateObj.toISOString().replace('.000', '') === value;
}
