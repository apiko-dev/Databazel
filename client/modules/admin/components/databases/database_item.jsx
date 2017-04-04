import React, { PropTypes } from 'react';
import DeleteIcon from '/node_modules/material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import DatabaseForm from '../../containers/databases/database_form';
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import i18n from 'meteor/universe:i18n';
import { ListItem } from 'material-ui/List';

const styles = {
  resetBtn: {
    position: 'absolute',
    right: '5px',
    top: 0,
  },
};

class DatabaseItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isDatabaseOpen: false };
    this.updateDatabase = this.updateDatabase.bind(this);
  }
  updateDatabase(model) {
    const { updateDatabase, database, index } = this.props;
    if (model.mountName !== database.name || model.mongoUrl !== database.mongoUri) {
      updateDatabase({
        mountName: database.name,
        mongoUrl: database.mongoUri,
        index,
      }, model);
    }
    this.setState({ isDatabaseOpen: false });
  }
  render() {
    const { database, deleteDatabase, index } = this.props;
    const { isDatabaseOpen } = this.state;
    return (
      <div className="database-item">
        {!isDatabaseOpen ?
          <ListItem
            primaryText={database.name}
            onTouchTap={() => this.setState({ isDatabaseOpen: true })}
            rightIconButton={
              <IconButton onTouchTap={() => deleteDatabase(database.name, index)}>
                <DeleteIcon />
              </IconButton>
            }
          />
          :
          <div className="edit-database-form">
            <div className="form">
              <DatabaseForm submit={this.updateDatabase} database={database} />
            </div>
            <IconButton
              tooltip={i18n.__('reset')}
              onTouchTap={() => this.setState({ isDatabaseOpen: false })}
              style={styles.resetBtn}
            >
              <Refresh />
            </IconButton>
          </div>
        }
      </div>
    );
  }
}

DatabaseItem.propTypes = {
  index: PropTypes.number,
  database: PropTypes.object,
  deleteDatabase: PropTypes.func,
  updateDatabase: PropTypes.func,
};

export default DatabaseItem;
