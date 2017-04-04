import i18n from 'meteor/universe:i18n';

export default {
  createDatabase({ Meteor, Notificator }, mountName, uri, cb) {
    Meteor.call('quasar.createMount', mountName, uri, (err) => {
      if (err) Notificator.important(err.reason || 'Quasar error');
      cb(err);
    });
  },
  deleteDatabase({ Notificator, Meteor }, mountName, cb) {
    Notificator.interaction(`${i18n.__('confirm_delete_database')}`, {
      confirmLabel: i18n.__('delete'),
      confirmFunction() {
        Meteor.call('quasar.deleteMount', mountName, (err) => {
          if (err) Notificator.important(err.reason || 'Quasar error');
          else cb();
        });
      },
      title: i18n.__('delete'),
    });
  },
  updateDatabase({ Notificator, Meteor }, database, newDatabase, cb) {
    const confirmFunction = () => {
      Meteor.call('quasar.updateMount', database, newDatabase, (err) => {
        if (err) {
          Notificator.important(err.reason || 'Quasar error');
          Meteor.call('quasar.createMount', database.mountName, database.mongoUrl, () => cb(err));
        } else {
          Meteor.call('charts.updateChartMount', database, newDatabase, () => cb(err));
        }
      });
    };

    Notificator.interaction(`${i18n.__('confirm_update_database')}`, {
      confirmFunction,
      cancelFunction: () => cb(true),
      confirmLabel: i18n.__('update'),
      title: i18n.__('warning'),
    });
  },
};
