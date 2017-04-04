import * as Collections from '/lib/collections';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import Notificator from '../single_components/notificator';
import MainLayout from '../modules/core/components/material-ui-container.jsx';

FlowRouter.notFound = {
  action() {
    FlowRouter.go('home');
  },
};
const LocalState = new ReactiveDict();

export default function () {
  return {
    Meteor,
    FlowRouter,
    Collections,
    LocalState,
    Tracker,
    MainLayout,
    Notificator: new Notificator(LocalState),
  };
}
