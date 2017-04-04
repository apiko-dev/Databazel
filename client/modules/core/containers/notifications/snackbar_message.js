import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import SnackbarMessage from '../../components/notifications/snackbar_message.jsx';

export const composer = ({ context, clearMessage }, onData) => {
  const { LocalState } = context();
  const { message, status } = LocalState.get('SNACKBAR_MESSAGE') || { message: '' };
  onData(null, { message, status, clearMessage });
};

export const depsMapper = (context, actions) => ({
  context: () => context,
  clearMessage: actions.core.clearMessage,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(SnackbarMessage);
