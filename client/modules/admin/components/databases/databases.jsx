import React, { PropTypes } from 'react';
import DatabaseForm from '../../containers/databases/database_form';
import DatabaseItem from './database_item.jsx';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import T from '/lib/i18n';
import i18n from 'meteor/universe:i18n';
import { List } from 'material-ui/List';

const styles = {
  header: {
    position: 'relative',
  },
  addBtn: {
    position: 'absolute',
    right: '4px',
  },
  refreshIndicator: {
    position: 'relative',
    margin: '27px auto',
  },
};

class Databases extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenedForm: props.databases && !props.databases.length,
      databases: props.databases,
      loading: false,
    };
    this.createDatabase = this.createDatabase.bind(this);
    this.deleteDatabase = this.deleteDatabase.bind(this);
    this.updateDatabase = this.updateDatabase.bind(this);
  }
  createDatabase({ mountName, mongoUrl }) {
    const { databases } = this.state;
    this.setState({ loading: true });

    this.props.createDatabase(mountName, mongoUrl, (err) => {
      if (!err) databases.push({ name: mountName });
      this.setState({
        databases,
        isOpenedForm: false,
        loading: false,
      });
    });
  }
  deleteDatabase(dbName, index) {
    const { databases } = this.state;
    this.props.deleteDatabase(dbName, () => {
      databases.splice(index, 1);
      this.setState({ databases });
    });
  }
  updateDatabase(database, newDatabase) {
    const { databases } = this.state;
    this.setState({ loading: true });

    this.props.updateDatabase(database, newDatabase, (err) => {
      if (!err) databases[database.index] = { name: newDatabase.mountName };
      this.setState({ databases, loading: false });
    });
  }
  render() {
    const { databases, isOpenedForm, loading } = this.state;
    if (this.props.isQuasarError) {
      return <div className="quasar-error">Quasar is not connected</div>;
    }
    return (
      <div className="row">
        <div className="col-xs-12">
          <Paper zDepth={1} className="databases-list">
            <List>
              <Subheader style={styles.header}>
                <T>databases</T>

                <IconButton
                  iconClassName="material-icons"
                  tooltip={!isOpenedForm ? i18n.__('add_database') : ''}
                  style={styles.addBtn}
                  onTouchTap={() => this.setState({ isOpenedForm: !isOpenedForm })}
                >
                  {isOpenedForm ? 'remove' : 'add'}
                </IconButton>
              </Subheader>
              <Divider />

              {isOpenedForm ?
                <div className="database-form">
                  <DatabaseForm submit={this.createDatabase} />
                </div>
              : ''}
              <Divider />

              {databases.map((database, i) => (
                <DatabaseItem
                  key={database.name}
                  index={i}
                  database={database}
                  deleteDatabase={this.deleteDatabase}
                  updateDatabase={this.updateDatabase}
                />
              ))}
            </List>
            {loading ?
              <div className="database-loading">
                <RefreshIndicator
                  left={0}
                  top={0}
                  status="loading"
                  style={styles.refreshIndicator}
                />
              </div>
            : ''}
          </Paper>
        </div>
      </div>
    );
  }
}

Databases.propTypes = {
  isQuasarError: PropTypes.bool,
  databases: PropTypes.array,
  createDatabase: PropTypes.func,
  deleteDatabase: PropTypes.func,
  updateDatabase: PropTypes.func,
};

export default Databases;
