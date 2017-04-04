import React, { PropTypes } from 'react';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import { TableHeaderColumn } from 'material-ui/Table';

const style = {
  tableHeaderColumn: {
    padding: 0,
  },
  deleteFieldButton: {
    float: 'right',
    padding: 3,
    height: 20,
    width: 20,
    top: 13,
  },
  iconStyles: {
    top: 8,
    color: 'rgb(158, 158, 158)',
  },
  iconStyle: {
    fontSize: 17,
  },
};

class PreviewHeaderCol extends React.Component {
  constructor(props) {
    super(props);
    this.selectField = this.selectField.bind(this);
    this.deleteField = this.deleteField.bind(this);
    this.sort = this.sort.bind(this);
  }
  selectField() {
    const id = this.props.field.id;
    this.props.selectField(id);
  }
  deleteField() {
    const id = this.props.field.id;
    this.props.deleteField(id);
  }
  sort() {
    const { updateSelectedField, field } = this.props;
    switch (field.sort) {
      case 'asc': field.sort = 'desc';
        break;
      case 'desc': field.sort = false;
        break;
      default: field.sort = 'asc';
    }
    updateSelectedField(field);
  }
  render() {
    const { field, activeFieldId } = this.props;
    return (
      <TableHeaderColumn style={style.tableHeaderColumn}>
        <div
          className={
            activeFieldId === field.id ? 'table-col-header active-col' : 'table-col-header'
          }
          onClick={this.selectField}
        >
          <span className="sort-area" onTouchTap={this.sort}>
            <span className="clip table-header-label">{field.name || field} </span>
            <FontIcon
              className={!field.sort ? 'material-icons rotate90' : 'material-icons'}
              style={style.iconStyles}
            >
              {!field.sort ? 'code' : ''}
              {field.sort === 'desc' ? 'expand_less' : ''}
              {field.sort === 'asc' ? 'expand_more' : ''}
            </FontIcon>
          </span>

          <IconButton
            iconClassName="material-icons"
            style={style.deleteFieldButton}
            iconStyle={style.iconStyle}
            onTouchTap={this.deleteField}
          >
            clear
          </IconButton>
        </div>
      </TableHeaderColumn>
    );
  }
}

PreviewHeaderCol.propTypes = {
  activeFieldId: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.bool,
  ]),
  field: PropTypes.object,
  deleteField: PropTypes.func.isRequired,
  updateSelectedField: PropTypes.func.isRequired,
  selectField: PropTypes.func.isRequired,
};

export default PreviewHeaderCol;
