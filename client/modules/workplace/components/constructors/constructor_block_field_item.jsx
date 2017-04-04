import React, { PropTypes } from 'react';
import FilterButton from '/client/modules/workplace/components/filters/filter_button.jsx';
import i18n from 'meteor/universe:i18n';
import IconButton from 'material-ui/IconButton/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import { _ } from 'meteor/underscore';
import { ListItem } from 'material-ui/List';
import { grey300, grey500 } from 'material-ui/styles/colors';

const styles = {
  listItem: {
    backgroundColor: grey300,
    margin: 3,
    fontSize: '0.9em',
    lineHeight: '32px',
  },
  iconMenu: {
    position: 'absolute',
    height: 32,
    left: 27,
  },
  button: {
    top: 0,
    width: 24,
    height: 32,
    padding: 2,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    fill: grey500,
  },
  deleteBtn: {
    tooltip: {
      top: 2,
    },
  },
  filterBtn: {
    tooltip: {
      top: 2,
      left: -5,
    },
  },
  actionBtn: {
    tooltip: {
      top: 2,
    },
  },
};

class ConstructorBlockFieldItem extends React.Component {
  constructor(props) {
    super(props);
    this.renderFilterButton = this.renderFilterButton.bind(this);
  }

  renderFilterButton(field) {
    const { filterFunc } = this.props;
    const buttonStyle = _.extend(_.clone(styles.button), { position: 'absolute', left: 4 });
    return (
      <FilterButton
        type={field.type}
        buttonStyle={buttonStyle}
        iconStyle={styles.buttonIcon}
        filters={field.filters}
        field={field.expression}
        tooltipPosition={'top-right'}
        tooltipStyles={styles.filterBtn.tooltip}
        updateCurrentField={someFunc => filterFunc(someFunc(field))}
      />
    );
  }

  render() {
    const { label, field, action, deleteField } = this.props;
    const getFieldFunc = f => f.expression.slice(0, f.expression.indexOf('('));
    const needAction = action && action.needAction(field);
    return (
      <ListItem
        style={styles.listItem}
        innerDivStyle={{ padding: `0px 25px 0px ${needAction ? 54 : 30}px` }}
        key={field.name}
        rightIconButton={
          <IconButton
            style={styles.button}
            iconStyle={styles.buttonIcon}
            tooltip={i18n.__('delete')}
            tooltipPosition={'top-left'}
            tooltipStyles={styles.deleteBtn.tooltip}
            onTouchTap={() => deleteField(field, label)}
            children={<ClearIcon />}
          />
        }
      >
        {this.renderFilterButton(field)}
        {needAction ? action.renderButton(field, styles) : ''}
        <div className="field-name">
          {label !== 'values' ? field.name :
            `${getFieldFunc(field)}(${field.name})`}
        </div>
      </ListItem>
    );
  }
}

ConstructorBlockFieldItem.propTypes = {
  label: PropTypes.string,
  field: PropTypes.object,
  action: PropTypes.object,
  deleteField: PropTypes.func,
  filterFunc: PropTypes.func,
};

export default ConstructorBlockFieldItem;
