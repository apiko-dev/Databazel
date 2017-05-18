import { cutOff, getParamName, parseQueryPartial } from '../utils';


const getFrom = query => {
  const matchRes = query.match(/\sfrom\s+([\w([\])"'`.,/=<>\s]+$)/im);
  if (!matchRes) return null;
  const from = matchRes[1].replace(cutOff, '');
  const name = getParamName(from);
  const path = parseQueryPartial(from, name);
  return { db: path[1], collection: path[2], name: name[1] };
};

export { getFrom };
