import { Charts, Dashboards } from '/lib/collections';

export default () => {
  Charts.after.remove((userId, doc) => {
    Dashboards.update(
      { chartsId: doc._id, users: userId },
      { $pull: { chartsId: doc._id } },
      { multi: true });
  });
};
