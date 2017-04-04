import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import IframeDialog from '../components/iframe_dialog';
import downloads from '/lib/downloads';

export const composer = ({ context, chartId, isPublished, copyTextToClipboard }, onData) => {
  const { Meteor, Notificator } = context();
  if (isPublished) {
    onData(null, {
      link: `${Meteor.absoluteUrl()}publishing/chart/${chartId}`,
      copyTextToClipboard: copyTextToClipboard.bind(null, Notificator),
    });
  } else {
    onData(null, {});
  }
};

export const depsMapper = (context, actions) => ({
  context: () => context,
  setIsPublished: actions.charts.setIsPublished,
  copyTextToClipboard: downloads.copyTextToClipboard,
});

export default composeAll(
  composeWithTracker(composer, () => null),
  useDeps(depsMapper)
)(IframeDialog);
