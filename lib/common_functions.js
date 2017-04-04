import { _ } from 'meteor/underscore';

export default {
  findFreeName(arr, name, i = 0) {
    const exist = !!arr.filter(n => n === `${name}${i ? `(${i})` : ''}`).length;
    let res;
    if (exist) res = this.findFreeName(arr, name, i + 1);
    else {
      if (/\((\d+)\)$/.test(name)) {
        res = name.replace(/\((\d+)$\)/, (foo, num) => `(${+num + 1})`);
      } else {
        res = `${name}${i ? `(${i})` : ''}`;
      }
    }
    return res;
  },
};
