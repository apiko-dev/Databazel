import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import DialogImportant from '../../components/notifications/dialog_important';

export const composer = ({ context, clearDialogImportant }, onData) => {
  const { LocalState } = context();
  const dialogData = LocalState.get('DIALOG_IMPORTANT');
  const { message, title } = dialogData || {};
  onData(null, { message, title, clearDialogImportant });
};

export const depsMapper = (context, actions) => ({
  context: () => context,
  clearDialogImportant: actions.core.clearDialogImportant,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(DialogImportant);
