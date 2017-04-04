import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import FormatColorFill from 'material-ui/svg-icons/editor/format-color-fill';
import Toggle from 'material-ui/Toggle';
import { ListItem } from 'material-ui/List';

class FormatNumberItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(foo, isValuesColored) {
    const { pivot, updateViewObj } = this.props;
    Object.assign(pivot, { isValuesColored });
    updateViewObj({ pivot });
  }

  render() {
    const { menuParams: { styles }, pivot } = this.props;
    return (
      <ListItem
        primaryText={i18n.__('color values')}
        leftIcon={<FormatColorFill style={styles.icon} />}
        style={styles.root}
        innerDivStyle={styles.innerDiv}
        rightToggle={
          <Toggle
            onToggle={this.handleChange}
            defaultToggled={pivot.isValuesColored}
            style={styles.toggle}
          />
        }
      />
    );
  }
}

FormatNumberItem.propTypes = {
  itemsParams: PropTypes.object.isRequired,
  updateViewObj: PropTypes.func.isRequired,
  menuParams: PropTypes.object.isRequired,
  pivot: PropTypes.object.isRequired,
};

export default FormatNumberItem;
