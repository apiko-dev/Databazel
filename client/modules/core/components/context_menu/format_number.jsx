import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import FormatNumberIcon from 'material-ui/svg-icons/image/filter-1';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import { ListItem } from 'material-ui/List';
import { _ } from 'meteor/underscore';

class FormatNumberItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ template }) {
    const { itemsParams: { field }, updateSelectedField, menuParams } = this.props;
    field.numberTemplate = template;
    updateSelectedField(field);
    menuParams.closeContextMenu();
  }

  render() {
    const { itemsParams: { field }, menuParams: { styles } } = this.props;
    return (
      <ListItem
        primaryText={i18n.__('format number')}
        leftIcon={<FormatNumberIcon style={styles.icon} />}
        className="format-number-item"
        style={styles.root}
        innerDivStyle={styles.innerDiv}
        nestedListStyle={styles.nestedList}
        nestedItems={[
          <ListItem key={_.uniqueId()} innerDivStyle={styles.nestedInnerDiv}>
            <Formsy.Form onValidSubmit={this.handleChange}>
              <FormsyText
                style={styles.input}
                name="template"
                value={field.numberTemplate}
                validations={{ matchRegexp: /^(_*\.#*(.*)?)?$/ }}
                validationError={'Can be like ".###" or "___.# k$"'}
              />
            </Formsy.Form>
          </ListItem>,
        ]}
      />
    );
  }
}

FormatNumberItem.propTypes = {
  itemsParams: PropTypes.object.isRequired,
  updateSelectedField: PropTypes.func.isRequired,
  menuParams: PropTypes.object.isRequired,
};

export default FormatNumberItem;
