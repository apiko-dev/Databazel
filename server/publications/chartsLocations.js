import { Meteor } from 'meteor/meteor';
import { ChartsLocations } from '/lib/collections';

export default () => {
  Meteor.publish('chartsLocations', function () {
    return ChartsLocations.find({ userId: this.userId });
  });
};
