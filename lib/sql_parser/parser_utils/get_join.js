import { cutOff, getParamName, parseQueryPartial } from '../utils';

const getJoin = query => {
  const matchRes = query.match(/\sjoin\s+([\w([\])"'`.,/=<>\s]+$)/im);
  if (!matchRes) return null;
  // todo reafactor
  const from = matchRes[1].replace(cutOff, '');
  const name = getParamName(from);
  const path = parseQueryPartial(from, name);
  return path[2];
};

export { getJoin };
