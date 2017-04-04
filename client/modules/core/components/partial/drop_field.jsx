import React, { PropTypes } from 'react';

class DropField extends React.Component {
  constructor(props) {
    super(props);
    this.dropField = this.dropField.bind(this);
  }
  dropField(e) {
    const { addFieldToModelPart, addFieldToQueryObj, canAddFieldToChart,
      extendFieldData, tableType, modelPart, chartType } = this.props;
    const fieldData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const field = extendFieldData(fieldData, tableType, modelPart);

    if (canAddFieldToChart(chartType, field.constructorType)) {
      addFieldToQueryObj(field);
      if (tableType === 'pivot') {
        addFieldToModelPart({ fieldId: field.id, modelPart });
      }
    }
  }
  render() {
    const { label, vertical } = this.props;
    let className = 'backlight drop-area-container ';
    className += vertical ? 'rotate' : '';
    return (
      <div className={className}>
        <div
          className="drop-area"
          onDrop={this.dropField}
          onDragOver={e => e.preventDefault()}
        >
          <div className="label">{label || 'Add field'}</div>
        </div>
      </div>
    );
  }
}

DropField.propTypes = {
  tableType: PropTypes.string,
  label: PropTypes.string,
  modelPart: PropTypes.string,
  chartType: PropTypes.string,
  vertical: PropTypes.bool,
  addFieldToQueryObj: PropTypes.func,
  addFieldToModelPart: PropTypes.func,
  extendFieldData: PropTypes.func,
  canAddFieldToChart: PropTypes.func,
};

export default DropField;
