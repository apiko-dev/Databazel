import { _ } from 'meteor/underscore';
import { defaultChartLocation } from '/lib/constants';

const getDefaultChartLocation = chartId => _.extend(_.clone(defaultChartLocation), { i: chartId });

const getChartsLocationFromLayouts = (layout) => {
  const locations = {};
  _.each(layout, (locs, bp) => {
    _.each(locs, (loc) => {
      if (!locations[loc.i]) locations[loc.i] = {};
      locations[loc.i][bp] = _.pick(loc, 'x', 'y', 'w', 'h');
    });
  });
  return locations;
};

export default {
  saveLayouts({ Meteor }, { dashboardId, newLayouts, oldLayouts }) {
    const newLocations = getChartsLocationFromLayouts(newLayouts);
    const oldLocations = getChartsLocationFromLayouts(oldLayouts);
    let isChartRemoved = false;
    _.each(newLocations, (loc) => {
      if (_.keys(loc).length !== 5) isChartRemoved = true;
    });
    if (!_.isEqual(newLocations, oldLocations) && !isChartRemoved) {
      Meteor.call('dashboard.saveChartsLocation', { dashboardId, newLocations });
    }
  },
  handleSharing({ Meteor }, { dashboardId, usersIdsSharedTo, currentUsersIds }) {
    const unsharedFrom = _.difference(usersIdsSharedTo, currentUsersIds)[0];
    const sharedTo = _.difference(currentUsersIds, usersIdsSharedTo)[0];
    Meteor.call('dashboard.handleSharingToUser', {
      entityId: dashboardId,
      userId: unsharedFrom || sharedTo,
      isSharing: !!sharedTo,
    });
  },
  parseChartsLocations(context, { chartsLocations, chartsWOLocations }) {
    let layouts = {};
    _.each(chartsLocations, chartLocations => {
      _.each(chartLocations.breakpoints, (location, breakpoint) => {
        if (!layouts[breakpoint]) layouts[breakpoint] = [];
        layouts[breakpoint].push(_.extend(location, { i: chartLocations.chartId }));
      });
    });
    _.each(chartsWOLocations, chartId => {
      if (_.keys(layouts).length === 0) layouts = { lg: [], md: [], sm: [], xs: [], xxs: [] };
      _.each(layouts, (layout, breakpoint) => {
        layouts[breakpoint].push(getDefaultChartLocation(chartId));
      });
    });
    return layouts;
  },
};
