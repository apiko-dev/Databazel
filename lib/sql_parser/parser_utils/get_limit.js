const getLimit = query => {
  const limit = query.match(/\slimit\s+(\d+)/i);
  if (limit) return +limit[1];
  return null;
};

export { getLimit };
