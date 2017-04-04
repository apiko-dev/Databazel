import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import DialogInteraction from '../../components/notifications/dialog_interaction.jsx';

export const composer = ({ context, clearDialogInteraction }, onData) => {
  const { LocalState, Notificator } = context();
  const message = LocalState.get('DIALOG_INTERACTION');
  const options = Notificator.interactionOptions;
  onData(null, { message, options, clearDialogInteraction });
};

export const depsMapper = (context, actions) => ({
  context: () => context,
  clearDialogInteraction: actions.core.clearDialogInteraction,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(DialogInteraction);
