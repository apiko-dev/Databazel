import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { grey300 } from 'material-ui/styles/colors';

const style = {
  toolbar: {
    height: '40px',
    padding: '5px',
    backgroundColor: grey300,
  },
  iconButton: {
    padding: '0px',
    width: '38px',
    height: '30px',
    cursor: 'default',
  },
};

class JoiningCollections extends React.Component {
  constructor(props) {
    super(props);
    this.dropField = this.dropField.bind(this);
  }
  dropField(e) {
    const fieldData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const field = e.currentTarget.dataset.field;
    const on = this.props.getSQLQueryObj('on').on || {};
    on[field] = fieldData;
    this.props.updateSQLQueryObj({ on });
  }
  render() {
    const { leftField, rightField } = this.props;
    return (
      <div className="joining-collections">
        <Toolbar style={style.toolbar}>
          <div
            className="left-area-key backlight"
            data-field="leftField"
            onDrop={this.dropField}
            onDragOver={e => e.preventDefault()}
          >
            {leftField ? <span>{leftField.name}</span> : ''}
          </div>

          <ToolbarGroup>
            <IconButton iconClassName="material-icons" style={style.iconButton}>
              insert_link
            </IconButton>
          </ToolbarGroup>

          <div
            className="right-area-key backlight"
            data-field="rightField"
            onDrop={this.dropField}
            onDragOver={e => e.preventDefault()}
          >
            {rightField ? <span>{rightField.name}</span> : ''}
          </div>
        </Toolbar>
      </div>
    );
  }
}

JoiningCollections.propTypes = {
  updateSQLQueryObj: PropTypes.func,
  getSQLQueryObj: PropTypes.func,
  leftField: PropTypes.object,
  rightField: PropTypes.object,
};

export default JoiningCollections;
