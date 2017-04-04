import React, { PropTypes } from 'react';
import ChartConstructorBlock from '../../../core/components/partial/chart_constructor_block.jsx';
import { chartTypeRules } from '/lib/constants';
import { _ } from 'meteor/underscore';

const ChartConstructor = props => {
  const { viewObj, queryObj, updateSQLQueryObj, getNewChartModelFields } = props;
  const { chartType } = viewObj;
  const { fields } = queryObj;
  if (!chartType) return null;
  const handleCheck = field => updateSQLQueryObj(
    { fields: getNewChartModelFields({ chartType, fields }, field) }
  );
  return (
    <div className="col-xs-12 col-sm-12 col-md-4 constructor-model">
      <div className="row">
        {_.keys(chartTypeRules[chartType]).map(label => (
          <ChartConstructorBlock
            key={label}
            label={label}
            fields={fields}
            handleCheck={handleCheck}
          />
        ))}
      </div>
    </div>
  );
};

ChartConstructor.propTypes = {
  viewObj: PropTypes.object,
  queryObj: PropTypes.object,
  updateSQLQueryObj: PropTypes.func,
  getNewChartModelFields: PropTypes.func,
};

export default ChartConstructor;
