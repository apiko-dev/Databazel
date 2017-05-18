const getOffset = query => {
  const offset = query.match(/\soffset\s+(\d+)/i);
  if (offset) return +offset[1];
  return null;
};

export { getOffset };
