import React, { PropTypes } from 'react';
import Codemirror from 'react-codemirror';
import CodeMirror from 'codemirror/lib/codemirror';
import { _ } from 'meteor/underscore';
import 'codemirror/mode/sql/sql';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/search/searchcursor';

class SQLEditor extends React.Component {
  constructor(props) {
    super(props);
    this.keywords = _.extend(CodeMirror.resolveMode('text/x-sql').keywords, {
      case: true,
      when: true,
      then: true,
      else: true,
      end: true,
      offset: true,
    });
    CodeMirror.extendMode('text/x-sql', { keywords: this.keywords });
  }
  render() {
    const codemirrorOptions = {
      mode: 'text/x-sql',
      lineWrapping: true,
      indentWithTabs: true,
      matchBrackets: true,
      lineNumbers: true,
      indentUnit: 4,
      autofocus: true,
      // readOnly: true,
    };
    const { query, onChange } = this.props;
    return (
      <Codemirror
        value={query}
        options={codemirrorOptions}
        onChange={onChange}
      />
    );
  }
}

SQLEditor.propTypes = {
  query: PropTypes.string,
  onChange: PropTypes.func,
};

export default SQLEditor;
