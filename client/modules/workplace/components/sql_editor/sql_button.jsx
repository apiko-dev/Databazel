import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import i18n from 'meteor/universe:i18n';
import IconButton from 'material-ui/IconButton';
import SQLEditor from './sql_editor.jsx';
import 'codemirror/mode/sql/sql';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/search/searchcursor';

const style = {
  dialog: {
    body: {
      fontSize: '14px',
      paddingTop: 16,
      width: 'auto',
    },
  },
};

class SQLButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      canSubmit: false,
      query: props.query,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.state.query) {
      this.setState({ query: nextProps.query });
    }
  }
  onChangeHandler(query) {
    this.setState({ query });
  }
  handleSubmit() {
    const { query } = this.state;
    if (query !== this.props.query) {
      this.props.setSQLQuery(query);
    }
    this.setState({
      open: false,
      query: this.props.query,
    });
  }
  handleCancel() {
    this.setState({
      open: false,
      query: this.props.query,
    });
  }
  renderAction() {
    return [
      <FlatButton
        label="Cancel"
        onTouchTap={this.handleCancel}
      />,
      <FlatButton
        label="OK"
        onTouchTap={this.handleSubmit}
        primary
      />,
    ];
  }
  render() {
    return (
      <span>
        <IconButton
          iconClassName="material-icons"
          tooltip={i18n.__('sql_query')}
          onTouchTap={() => this.setState({ open: true })}
        >
          code
        </IconButton>
        <Dialog
          title={i18n.__('sql_query')}
          actions={this.renderAction()}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleCancel}
          bodyStyle={style.dialog.body}
          autoScrollBodyContent
        >
          <SQLEditor
            query={this.state.query}
            onChange={this.onChangeHandler}
            ref="sqlEditor"
          />
        </Dialog>
      </span>
    );
  }
}

SQLButton.propTypes = {
  query: PropTypes.string,
  setSQLQuery: PropTypes.func,
};

export default SQLButton;
