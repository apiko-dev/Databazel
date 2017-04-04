import { useDeps, composeWithTracker, composeAll } from 'mantra-core';
import SignIn from '../components/sign_in.jsx';

export const composer = ({ context }, onData) => {
  const { LocalState } = context();
  const loginError = LocalState.get('LOGIN_ERROR');
  onData(null, { loginError });
};

export const depsMapper = (context, actions) => ({
  signIn: actions.accounts.signIn,
  context: () => context,
});

export default composeAll(
  composeWithTracker(composer),
  useDeps(depsMapper)
)(SignIn);
