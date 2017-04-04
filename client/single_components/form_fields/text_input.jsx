import React from 'react';
import TextField from 'material-ui/TextField';

class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
    this.handelInput = this.handelInput.bind(this);
    this.dropField = this.dropField.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value === this.props.value) return;
    this.setState({ value: nextProps.value });
  }
  handelInput(e) {
    this.setState({ value: e.currentTarget.value });
  }
  dropField(e) {
    const input = e.currentTarget;
    const fieldData = JSON.parse(e.dataTransfer.getData('text/plain'));
    this.setState({ value: this.state.value + fieldData.expression });
    input.focus();
  }
  render() {
    const { style, onBlur, hintText, fullWidth } = this.props;
    return (
      <TextField
        onBlur={onBlur}
        hintText={hintText}
        style={style}
        onDrop={this.dropField}
        onDragOver={e => e.preventDefault()}
        value={this.state.value}
        onChange={this.handelInput}
        fullWidth={fullWidth}
      />
    );
  }
}

TextInput.propTypes = {
  value: React.PropTypes.string,
  hintText: React.PropTypes.string,
  onBlur: React.PropTypes.func,
  fullWidth: React.PropTypes.bool,
  style: React.PropTypes.object,
};

export default TextInput;
