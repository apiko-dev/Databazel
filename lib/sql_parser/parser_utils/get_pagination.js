const getPagination = query => {
  return {
    limit: query.limit,
    page: query.skip ? query.skip / query.limit : 1,
  };
};

export { getPagination };
