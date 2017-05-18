const getHavingObj = query => {
  const having = {};
  if (query.having) {
    // todo refactor
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
};

export { getHavingObj };
