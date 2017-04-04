import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import DialogBasic from './dialog_basic';

export default class DialogImportant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: !!props.message,
    };
    this.getActions = this.getActions.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: !!nextProps.message,
    });
  }

  getActions() {
    return [<FlatButton label="Close" primary onTouchTap={this.handleClose} />];
  }

  handleClose() {
    this.props.clearDialogImportant();
    this.setState({ open: false });
  }

  render() {
    const { message, title } = this.props;
    return (
      <DialogBasic
        message={message}
        title={title}
        onRequestClose={this.handleClose}
        getActions={this.getActions}
        open={this.state.open}
      />
    );
  }
}

DialogImportant.propTypes = {
  message: PropTypes.string,
  title: PropTypes.string,
  clearDialogImportant: PropTypes.func,
};
