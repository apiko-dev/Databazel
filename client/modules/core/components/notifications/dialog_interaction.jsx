import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import DialogBasic from './dialog_basic';

export default class DialogInteraction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: !!props.message,
    };
    this.getActions = this.getActions.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleOK = this.handleOK.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: !!nextProps.message,
    });
  }

  getActions() {
    const { cancelLabel, confirmLabel } = this.props.options;
    return [
      <FlatButton
        label={cancelLabel || 'Dismiss'}
        primary
        onTouchTap={this.handleDismiss}
      />,
      <FlatButton
        label={confirmLabel || 'OK'}
        primary
        keyboardFocused
        onTouchTap={this.handleOK}
      />,
    ];
  }

  handleClose() {
    this.props.clearDialogInteraction();
    this.setState({ open: false });
  }

  handleDismiss() {
    this.handleClose();
    const { cancelFunction } = this.props.options;
    if (cancelFunction) cancelFunction();
  }

  handleOK() {
    this.handleClose();
    const { confirmFunction } = this.props.options;
    if (confirmFunction) confirmFunction();
  }

  render() {
    const { message } = this.props;
    const { title } = this.props.options;
    return (
      <DialogBasic
        message={message}
        title={title || 'Action is needed'}
        onRequestClose={this.handleClose}
        getActions={this.getActions}
        open={this.state.open}
      />
    );
  }
}

DialogInteraction.propTypes = {
  options: PropTypes.object,
  message: PropTypes.string,
  clearDialogInteraction: PropTypes.func,
};
