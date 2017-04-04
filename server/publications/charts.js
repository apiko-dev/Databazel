import { Meteor } from 'meteor/meteor';
import { Charts } from '/lib/collections';
import { check, Match } from 'meteor/check';

export default () => {
  Meteor.publish('charts', function (chartId) {
    check(chartId, Match.Maybe(String));
    const query = { users: this.userId };
    if (chartId) query._id = chartId;
    return Charts.find(query);
  });

  Meteor.publish('charts.light', function (chartId) {
    check(chartId, Match.Maybe(String));
    if (this.userId) {
      const query = Meteor.users.findOne(this.userId).isAdmin ? {} : { users: this.userId };
      const projection = {
        viewObject: 0,
        queryObject: 0,
      };
      if (chartId) query._id = chartId;
      return Charts.find(query, projection);
    }
  });

  Meteor.publish('charts.images', function (chartsId) {
    check(chartsId, Array);
    if (this.userId) {
      const query = {
        _id: { $in: chartsId },
        users: this.userId,
        'viewObject.chartType': { $ne: null },
      };
      return Charts.find(query);
    }
  });

  Meteor.publish('charts.published', function (chartId) {
    check(chartId, String);
    return Charts.find({ _id: chartId, isPublished: true });
  });
};
