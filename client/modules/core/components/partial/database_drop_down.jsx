import React, { PropTypes } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  selectField: {
    width: 'auto',
  },
  underlineStyle: {
    display: 'none',
  },
  labelStyle: {
    color: 'white',
    top: '-2px',
    paddingRight: '30px',
  },
};

class ComponentName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDatabase: props.current,
    };
    this.handelChange = this.handelChange.bind(this);
  }
  handelChange(e, key, value) {
    this.props.changeDatabase(value);
    this.setState({ currentDatabase: value });
  }
  render() {
    const { databases } = this.props;
    const { currentDatabase } = this.state;
    return (
      <SelectField
        value={currentDatabase}
        onChange={this.handelChange}
        style={styles.selectField}
        underlineStyle={styles.underlineStyle}
        labelStyle={styles.labelStyle}
        autoWidth
      >
        {databases && databases.map(database => (
          <MenuItem
            key={database.name}
            value={database.name}
            primaryText={database.name}
          />
        ))}
      </SelectField>
    );
  }
}

ComponentName.propTypes = {
  current: PropTypes.string,
  databases: PropTypes.array,
  changeDatabase: PropTypes.func,
};

export default ComponentName;
