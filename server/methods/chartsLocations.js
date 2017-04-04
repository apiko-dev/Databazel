import { Meteor } from 'meteor/meteor';
import { ChartsLocations } from '/lib/collections';
import { check } from 'meteor/check';

export default () => {
  Meteor.methods({
    'chartsLocations.remove'(selector) {
      check(selector, Object);
      if (!this.userId) throw new Meteor.Error('401', 'User not found');
      ChartsLocations.remove(selector);
    },
  });
};
