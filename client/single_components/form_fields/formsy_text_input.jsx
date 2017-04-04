import React from 'react';

import FormsyText from 'formsy-material-ui/lib/FormsyText';

export default class FormsyTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.refs.input.setValue(e.currentTarget.value);
  }

  render() {
    return <FormsyText {...this.props} onChange={this.onChange} ref="input" />;
  }
}
