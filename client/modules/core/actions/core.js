import i18n from 'meteor/universe:i18n';
import { _ } from 'meteor/underscore';

export default {
  redirectToLogin({ Meteor, FlowRouter }, onlyAdmin) {
    const user = Meteor.user();
    if (!user && FlowRouter.current().path.indexOf('reset-password') === -1) {
      FlowRouter.go('accounts.signIn');
    }
    if (onlyAdmin && user && !user.isAdmin) {
      FlowRouter.go('home');
    }
  },

  clearMessage({ LocalState }) {
    return LocalState.set('SNACKBAR_MESSAGE', null);
  },

  clearDialogImportant({ LocalState }) {
    return LocalState.set('DIALOG_IMPORTANT', null);
  },

  clearDialogInteraction({ LocalState, Notificator }) {
    Notificator.interactionOptions = {};
    return LocalState.set('DIALOG_INTERACTION', null);
  },

  getSidebarItemsList({ Collections, FlowRouter }, { listName, limit }) {
    const currentRouteName = FlowRouter.getRouteName();
    let currentParam;
    switch (currentRouteName) {
      case 'dashboard': currentParam = FlowRouter.getParam('dashboardId'); break;
      case 'chartEditor': currentParam = FlowRouter.getParam('chartId'); break;
      default: currentParam = undefined;
    }
    let list;
    const sort = listName === 'charts' ? { modified: -1 } : { viewsCounter: -1 };
    const collectionName = listName[0].toUpperCase() + listName.slice(1);
    const isViewedItemInSideBar = currentParam && (
      `${currentRouteName}s` === listName || `${currentRouteName.slice(0, 5)}s` === listName);
    if (isViewedItemInSideBar) {
      list = Collections[collectionName]
        .find({ _id: { $ne: currentParam } }, { sort, limit: limit - 1 }).fetch();
      list.unshift(Collections[collectionName].findOne({ _id: currentParam }));
    } else {
      list = Collections[collectionName].find({}, { sort, limit }).fetch();
    }
    return { list, currentRouteName, currentParam };
  },

  routeTo(context, name, params, queryParams) {
    const { FlowRouter } = context;
    const currentRoute = FlowRouter.getRouteName();
    const goToRoute = () => FlowRouter.go(name, params, queryParams);
    if (currentRoute === 'chartEditor' || currentRoute === 'workplace') {
      checkLeavingWorkplace(context, goToRoute, currentRoute);
    } else goToRoute();
  },

  routePath({ FlowRouter }, { name, params, queryParams }) {
    return FlowRouter.path(name, params, queryParams);
  },

  meteorMethodCall({ Meteor, Notificator }, methodName, params, cb, confirm) {
    const callMethod = () => {
      Meteor.call(methodName, params, (err, res) => {
        if (cb) cb(err, res, Notificator);
      });
    };
    if (!confirm) callMethod();
    else {
      const { message, options } = confirm;
      options.confirmFunction = callMethod;
      Notificator.interaction(message, options);
    }
  },

  checkQuasarConnection({ Notificator, FlowRouter }, err, mounts) {
    if (err) Notificator.important(i18n.__('quasar_error_connection'));
    if (!err && !mounts.length) {
      Notificator.interaction(i18n.__('database_error_connection'), {
        confirmLabel: i18n.__('create_database'),
        confirmFunction() {
          FlowRouter.go('databases');
        },
        title: i18n.__('warning'),
      });
    }
    return !err && mounts.length;
  },

  changeDatabase({ Meteor, LocalState, Notificator }, newMount) {
    LocalState.set('SQL_QUERY_OBJECT', null);
    const preMount = LocalState.get('CURRENT_DATABASE').mount;
    if (preMount !== newMount) {
      Meteor.call('quasar.getMount', newMount, (err, mount) => {
        if (err) Notificator.important(i18n.__('quasar_error_connection'));
        const databaseName = mount.connectionUri.match(/[\w_\-\d]+?$/)[0];
        LocalState.set('CURRENT_DATABASE', {
          mount: newMount,
          name: databaseName,
        });
      });
    }
  },
};

function checkLeavingWorkplace(context, goToRoute, currentRoute) {
  const { LocalState, FlowRouter, Notificator, Collections } = context;
  const queryObjectCurrent = LocalState.get('SQL_QUERY_OBJECT');

  if (currentRoute === 'workplace' && queryObjectCurrent && queryObjectCurrent.fields) {
    askForStayingWorkplace(Notificator, goToRoute);
  } else if (currentRoute === 'chartEditor') {
    const chartId = FlowRouter.getParam('chartId');
    const viewObjectCurrent = LocalState.get('VIEW_OBJECT');
    const { queryObject, viewObject } = Collections.Charts.findOne({ _id: chartId });
    if (_.isEqual(queryObject, queryObjectCurrent) &&
      _.isEqual(_.omit(viewObject, 'data'), _.omit(viewObjectCurrent, 'data'))
    ) {
      goToRoute();
    } else askForStayingWorkplace(Notificator, goToRoute);
  } else {
    goToRoute();
  }
}

function askForStayingWorkplace(Notificator, goToRoute) {
  return Notificator.interaction(
    i18n.__(
      'You have unsaved changes. Would you confirm leaving without saving?'
    ), {
      confirmLabel: i18n.__('Leave'),
      confirmFunction() {
        goToRoute();
      },
      title: i18n.__('warning'),
    }
  );
}
