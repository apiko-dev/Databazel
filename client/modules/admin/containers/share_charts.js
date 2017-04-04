import ShareCharts from '../components/share_charts.jsx';
import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import { _ } from 'meteor/underscore';

export const composer = ({ context, userId }, onData) => {
  const { Meteor, Collections } = context();
  if (Meteor.subscribe('charts.light').ready()) {
    const charts = Collections.Charts.find({}, { fields: { users: 1, chartName: 1 } }).fetch();
    const selectedCharts = charts.reduce((previous, chart) => {
      if (~chart.users.indexOf(userId)) previous.push(chart._id);
      return previous;
    }, []);
    const defaultCharts = _.clone(selectedCharts);
    onData(null, { charts, selectedCharts, defaultCharts, userId });
  } else {
    onData(null, { userId });
  }
};

export const depsMapper = (context, actions) => ({
  context: () => context,
  shareCharts: actions.admin.shareCharts,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(ShareCharts);
