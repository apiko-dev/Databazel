import React, { PropTypes } from 'react';
import Paper from 'material-ui/Paper';
import Formsy from 'formsy-react';
import FormsyTextInput from '/client/single_components/form_fields/formsy_text_input';
import MailIcon from 'material-ui/svg-icons/content/mail';
import VpnKey from 'material-ui/svg-icons/communication/vpn-key';
import RaisedButton from 'material-ui/RaisedButton';
import { grey500 } from 'material-ui/styles/colors';

const style = {
  paper: {
    margin: '40px auto',
    textAlign: 'center',
    maxWidth: 550,
    padding: '0 20px 20px 20px',
  },
  formsyText: {
    width: 'calc(100% - 144px)',
  },
  iconStyles: {
    marginRight: 16,
    position: 'relative',
    top: '3px',
  },
  raisedButton: {
    marginLeft: 16,
  },
  errorMessage: {
    paddingTop: 20,
  },
};

class CreatingUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = { canSubmit: false };
    this.submitForm = this.submitForm.bind(this);
  }
  submitForm({ email, password }) {
    const { token } = this.props;
    if (email) {
      this.props.inviteUser(email);
    } else {
      this.props.resetPassword(password, token);
    }
  }
  render() {
    const { creatingUserError, type } = this.props;
    return (
      <Paper style={style.paper} zDepth={1}>
        <Formsy.Form
          onValidSubmit={this.submitForm}
          onValid={() => this.setState({ canSubmit: true })}
          onInvalid={() => this.setState({ canSubmit: false })}
          ref="inviteForm"
        >
          {creatingUserError ?
            <div className="error" style={style.errorMessage}>
              <span>Error: </span>
              <span>{creatingUserError}</span>
            </div>
          : ''}
          {type === 'email' ?
            <span>
              <MailIcon
                style={style.iconStyles}
                color={grey500}
              />
              <FormsyTextInput
                name="email"
                type="email"
                floatingLabelText="Email"
                validations="isEmail"
                validationError="This is not a valid email"
                style={style.formsyText}
                required
              />
            </span>
          : ''}
          {type === 'password' ?
            <span>
              <VpnKey
                style={style.iconStyles}
                color={grey500}
              />
              <FormsyTextInput
                name="password"
                type="password"
                floatingLabelText="Password"
                style={style.formsyText}
                required
              />
            </span>
            : ''}
          <RaisedButton
            label="Submit"
            type="submit"
            disabled={!this.state.canSubmit}
            style={style.raisedButton}
            primary
          />
        </Formsy.Form>
      </Paper>
    );
  }
}

CreatingUser.propTypes = {
  token: PropTypes.string,
  creatingUserError: PropTypes.string,
  type: PropTypes.string,
  inviteUser: PropTypes.func,
  resetPassword: PropTypes.func,
};

export default CreatingUser;
