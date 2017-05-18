const getSelect = query => {
  let select = query.match(/^\s*select\s+([\w([\])"'`*:&;.,/\s]+)from\s/i);
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
};

export { getSelect };
