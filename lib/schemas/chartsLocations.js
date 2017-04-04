import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';
import { defaultBreakpoints, defaultChartLocation } from '/lib/constants.js';

export default new SimpleSchema({
  chartId: {
    type: String,
  },
  dashboardId: {
    type: String,
  },
  userId: {
    type: String,
  },
  breakpoints: {
    type: Object,
    blackbox: true,
    custom() {
      const isBreakpointsValid = () => isObjectsKeysEqual(this.value, defaultBreakpoints);
      const isLocationsValid = () => {
        let result = true;
        _.each(_.values(this.value), location => {
          if (!isObjectsKeysEqual(location, defaultChartLocation)) result = false;
        });
        return result;
      };
      return isBreakpointsValid() && isLocationsValid();
    },
  },
});

function isObjectsKeysEqual(obj1, obj2) {
  let result = true;
  if (_.keys(obj1).length !== _.keys(obj2).length) result = false;
  _.each(_.keys(obj1), key => {
    if (!~_.keys(obj1).indexOf(key)) result = false;
  });
  return result;
}
