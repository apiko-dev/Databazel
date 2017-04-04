import React, { PropTypes } from 'react';
import Snackbar from 'material-ui/Snackbar';
import { red300, green400 } from 'material-ui/styles/colors';

const styles = {
  content: {
    textAlign: 'center',
  },
};

export default class SnackbarMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: !!props.message,
    };
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: !!nextProps.message,
    });
  }

  handleRequestClose() {
    this.props.clearMessage();
    this.setState({
      open: false,
    });
  }

  render() {
    const { message, status } = this.props;
    let color = 'white';
    if (status === 'negative') color = red300;
    if (status === 'positive') color = green400;
    return (
      <Snackbar
        open={this.state.open}
        message={message}
        autoHideDuration={6000}
        onRequestClose={this.handleRequestClose}
        contentStyle={Object.assign(styles.content, { color })}
      />);
  }
}

SnackbarMessage.propTypes = {
  message: PropTypes.string,
  status: PropTypes.string,
  clearMessage: PropTypes.func,
};
