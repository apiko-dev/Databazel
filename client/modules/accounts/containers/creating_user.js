import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import CreatingUser from '../components/creating_user.jsx';

export const composer = ({ context }, onData) => {
  const { LocalState, FlowRouter } = context();
  const creatingUserError = LocalState.get('CREATING_USER_ERROR');
  const token = FlowRouter.getParam('token');
  onData(null, { creatingUserError, token });
};

export const depsMapper = (context, actions) => ({
  inviteUser: actions.accounts.inviteUser,
  resetPassword: actions.accounts.resetPassword,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(CreatingUser);
