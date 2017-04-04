import React, { PropTypes } from 'react';
import Formsy from 'formsy-react';
import StringFilter from '/client/single_components/form_fields/filter_field.jsx';
import { _ } from 'meteor/underscore';

class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filters: props.filtersData || [] };
    this.updateFilters = this.updateFilters.bind(this);
    this.updateFiltersState = this.updateFiltersState.bind(this);
  }
  updateFilters(model) {
    const newFilters = _.values(_.omit(model, 'filterCurrent'));
    if (model.filterCurrent) newFilters.push(model.filterCurrent);
    this.props.updateFilters(newFilters);
  }
  updateFiltersState(processFilter) {
    const { filters } = this.state;
    const newFilters = processFilter(filters);
    this.setState({ filters: newFilters });
  }
  render() {
    const { field, type } = this.props;
    const { filters } = this.state;
    const lastFilter = filters && filters[filters.length - 1];
    return (
      <Formsy.Form
        onSubmit={this.updateFilters}
        ref="filterForm"
      >
        {filters.map((filterItem, i) => (
          <StringFilter
            name={`filter${i}`}
            key={i}
            field={field}
            value={filterItem.value}
            type={type}
            operator={filterItem.operator}
            joinOperator={filterItem.joinOperator}
            updateFiltersState={this.updateFiltersState}
            removeFilter={this.removeFilter}
          />
        ))}
        {!filters.length || (lastFilter && lastFilter.joinOperator) ?
          <StringFilter
            name="filterCurrent"
            field={field}
            type={type}
            updateFiltersState={this.updateFiltersState}
          />
        : ''}
      </Formsy.Form>
    );
  }
}

Filter.propTypes = {
  field: PropTypes.string,
  type: PropTypes.string,
  filtersData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  updateFilters: PropTypes.func,
};

export default Filter;
