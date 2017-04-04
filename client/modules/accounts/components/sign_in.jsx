import React, { PropTypes } from 'react';
import Divider from 'material-ui/Divider';
import Formsy from 'formsy-react';
import FormsyTextInput from '../../../single_components/form_fields/formsy_text_input';
import Person from 'material-ui/svg-icons/social/person';
import VpnKey from 'material-ui/svg-icons/communication/vpn-key';
import RaisedButton from 'material-ui/RaisedButton';
import { grey500 } from 'material-ui/styles/colors';
import { Card, CardTitle, CardText } from 'material-ui/Card';

const style = {
  card: {
    margin: '40px auto',
    textAlign: 'center',
    maxWidth: 450,
    overflow: 'hidden',
  },
  titleStyle: {
    fontSize: '16px',
  },
  formsyText: {
    width: 'calc(100% - 40px)',
  },
  iconStyles: {
    marginRight: 16,
    position: 'relative',
    top: '3px',
  },
  raisedButton: {
    marginTop: 26,
    marginBottom: 20,
    float: 'right',
  },
};

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = { canSubmit: false };
    this.submitForm = this.submitForm.bind(this);
  }
  submitForm(data) {
    this.props.signIn(data.email, data.password);
  }
  render() {
    const error = this.props.loginError;
    return (
      <Card style={style.card}>
        <CardTitle title="Login" titleStyle={style.titleStyle} />
        <Divider />
        <CardText>
          <Formsy.Form
            onValidSubmit={this.submitForm}
            onValid={() => this.setState({ canSubmit: true })}
            onInvalid={() => this.setState({ canSubmit: false })}
          >
            {error ?
              <div className="error">
                <span>Error: </span>
                <span>{error}</span>
              </div>
            : ''}
            <div>
              <Person
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
            </div>

            <div>
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
            </div>
            <RaisedButton
              label="Login"
              type="submit"
              disabled={!this.state.canSubmit}
              style={style.raisedButton}
              primary
            />
          </Formsy.Form>
        </CardText>
      </Card>
    );
  }
}

SignIn.propTypes = {
  signIn: PropTypes.func,
  loginError: PropTypes.string,
};

export default SignIn;
