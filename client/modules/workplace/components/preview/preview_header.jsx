import React, { PropTypes } from 'react';
import DropField from '/client/modules/core/containers/drop_field';
import PreviewHeaderCol from './preview_header_col.jsx';
import { TableHeaderColumn, TableRow } from 'material-ui/Table';

const style = {
  dropTableHeaderColumn: {
    padding: 0,
    height: 'auto',
    fontSize: 'inherit',
  },
};

class PreviewHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeFieldId: false };
    this.selectField = this.selectField.bind(this);
  }
  selectField(id) {
    this.props.updateToolbarState(id);
    this.setState({ activeFieldId: id });
  }
  render() {
    const { fields, chartType, deleteField, updateSelectedField } = this.props;
    const { activeFieldId } = this.state;

    return (
      <TableRow>
        {fields && fields.map((field, i) => (
          <PreviewHeaderCol
            key={i}
            field={field}
            activeFieldId={activeFieldId}
            deleteField={deleteField}
            updateSelectedField={updateSelectedField}
            selectField={this.selectField}
          />
        ))}

        <TableHeaderColumn style={style.dropTableHeaderColumn}>
          <DropField tableType="simple" chartType={chartType} />
        </TableHeaderColumn>
      </TableRow>
    );
  }
}

PreviewHeader.propTypes = {
  chartType: PropTypes.string,
  fields: PropTypes.array,
  updateToolbarState: PropTypes.func,
  deleteField: PropTypes.func,
  updateSelectedField: PropTypes.func,
};

export default PreviewHeader;
