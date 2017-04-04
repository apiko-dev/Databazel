import React, { PropTypes } from 'react';
import DropField from '/client/modules/core/containers/drop_field';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import TableIcon from 'material-ui/svg-icons/image/grid-on';
import PivotIcon from 'material-ui/svg-icons/image/view-compact';

const styles = {
  smallIcon: {
    width: 36,
    height: 36,
  },
  small: {
    width: 64,
    height: 64,
    padding: 12,
  },
};

class StartConstructor extends React.Component {
  constructor(props) {
    super(props);
    this.changeTableType = this.changeTableType.bind(this);
  }
  changeTableType() {
    const { tableType } = this.props;
    let newType;
    if (tableType === 'simple') newType = 'pivot';
    if (tableType === 'pivot') newType = 'simple';
    this.props.changeTableType(newType);
  }
  render() {
    const { tableType } = this.props;
    return (
      <div className="table-constructor">
        <div className="constructor-header">
          <Paper className="type-btn" zDepth={1}>
            <IconButton
              iconStyle={styles.smallIcon}
              style={styles.small}
              onTouchTap={this.changeTableType}
            >
              {tableType === 'simple' ? <PivotIcon /> : ''}
              {tableType === 'pivot' ? <TableIcon /> : ''}
            </IconButton>
          </Paper>

          <Paper className="paper-cols" zDepth={1}>
            <DropField
              label="Add columns"
              modelPart="columns"
              tableType={tableType}
            />
          </Paper>
        </div>

        {tableType === 'pivot' ?
          <div className="constructor-body">
            <Paper className="paper-rows" zDepth={1}>
              <DropField
                label="Add rows"
                modelPart="rows"
                tableType={tableType}
                vertical
              />
            </Paper>
            <Paper className="paper-values" zDepth={1}>
              <DropField
                label="Add values"
                modelPart="values"
                tableType={tableType}
              />
            </Paper>
          </div>
        : ''}
      </div>
    );
  }
}

StartConstructor.propTypes = {
  tableType: PropTypes.string,
  changeTableType: PropTypes.func,
};

export default StartConstructor;
