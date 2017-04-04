import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';

const styles = {
  root: {
    fontSize: '0.9em',
    padding: '2px',
  },
  icon: {
    marginRight: 8,
  },
};

const ChartConstructorBlock = ({ label, fields, handleCheck }) => (
  <div className="col-xs-12 constructor-part col-md-6">
    <div className="part-name">{i18n.__(label)}</div>
    <Divider />
    {fields.map(field => (
      <Checkbox
        key={field.id}
        label={field.name}
        defaultChecked={field.constructorType === label}
        style={styles.root}
        iconStyle={styles.icon}
        onCheck={(foo, isChecked) => handleCheck({ fieldId: field.id, isChecked, label })}
      />
    ))}
  </div>
);

ChartConstructorBlock.propTypes = {
  label: PropTypes.string,
  fields: PropTypes.array,
  handleCheck: PropTypes.func,
};

export default ChartConstructorBlock;
