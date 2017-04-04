import React, { PropTypes } from 'react';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import i18n from 'meteor/universe:i18n';

const styles = {
  mountName: {
    width: '120px',
    marginRight: '18px',
  },
  mongoUrl: {
    width: 'calc(100% - 138px)',
  },
  error: {
    position: 'absolute',
    top: '70px',
  },
};

class AddDatabaseForm extends React.Component {
  componentDidMount() {
    this.refs.mountName.focus();
  }
  render() {
    const { database } = this.props;
    return (
      <Formsy.Form
        className="database-from"
        onValidSubmit={(model) => this.props.submit(model)}
        noValidate
      >
        <FormsyText
          name="mountName"
          ref="mountName"
          floatingLabelText={!database ? i18n.__('mount_name') : ''}
          value={database && database.name}
          style={styles.mountName}
          errorStyle={styles.error}
          required
        />
        <FormsyText
          name="mongoUrl"
          ref="mongoUrl"
          hintText="mongodb://username:password@host:port/database"
          floatingLabelText={!database ? i18n.__('mongo_url') : ''}
          value={database && database.mongoUri}
          style={styles.mongoUrl}
          errorStyle={styles.error}
          validations={{
            matchRegexp: /mongodb:\/\/.+:\d+\/.+/,
          }}
          validationError="This is not a valid mongo url"
          required
        />
        <button type="submit" style={{ display: 'none' }} />
      </Formsy.Form>
    );
  }
}

AddDatabaseForm.propTypes = {
  database: PropTypes.object,
  submit: PropTypes.func,
};

export default AddDatabaseForm;
