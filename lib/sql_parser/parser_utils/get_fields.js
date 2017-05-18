const getFields = (query, having) => {
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
};

export { getFields };
