import {
  getSelect,
  getFrom,
  getHaving,
  getWhere,
  getLimit,
  getOffset,
  getJoin,
  getGroupBy,
  getOrderBy,
  getHavingObj,
  getPagination,
  getFields,
  getCollectionFields,
} from './parser_utils';

const parse = (query) => {
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
};

const parseToQueryObject = (rawQuery, fields) => {
  const query = parse(rawQuery);
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
};

export { parseToQueryObject };
