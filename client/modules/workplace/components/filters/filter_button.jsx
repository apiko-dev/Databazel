import React, { PropTypes } from 'react';
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import Filter from './filter.jsx';
import i18n from 'meteor/universe:i18n';
import DateFilter from './date_filter.jsx';
import BooleanFilter from './boolean_filter.jsx';
import FilterIcon from 'material-ui/svg-icons/content/filter-list';
import { _ } from 'meteor/underscore';
import { cyan500 } from 'material-ui/styles/colors';

class FilterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, filters: this.props.filters };
    this.openFilterForm = this.openFilterForm.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ filters: nextProps.filters });
  }
  openFilterForm(e) {
    e.preventDefault();
    this.setState({
      open: true,
      anchorEl: e.currentTarget,
    });
  }
  handleRequestClose() {
    const filterForm = this.refs.filter.refs.filterForm;
    if (filterForm) filterForm.submit();
    this.setState({ open: false });
  }
  updateFilters(newFilters) {
    this.props.updateCurrentField((currentField = {}) => {
      currentField.filters = newFilters;
      return currentField;
    });
    this.setState({ filters: newFilters });
  }
  renderFilterForm() {
    const { type, field } = this.props;
    const { filters } = this.state;
    let SelectedFilter;

    switch (type) {
      case 'number':
      case 'string':
        SelectedFilter = Filter;
        break;
      case 'date': SelectedFilter = DateFilter;
        break;
      case 'boolean': SelectedFilter = BooleanFilter;
        break;
      default: return null;
    }
    return (
      <SelectedFilter
        filtersData={filters}
        ref="filter"
        field={field}
        type={type}
        updateFilters={this.updateFilters}
        closePopover={() => this.setState({ open: false })}
      />
    );
  }
  render() {
    const {
      buttonStyle,
      iconStyle = {},
      tooltipPosition,
      tooltipStyles,
      disable,
      type,
    } = this.props;
    const { open, filters = [] } = this.state;
    const iconButtonStyle = _.extend(_.clone(iconStyle), filters.length ? { fill: cyan500 } : {});
    return (
      <span>
        <IconButton
          onTouchTap={this.openFilterForm}
          style={buttonStyle}
          iconStyle={iconButtonStyle}
          disabled={disable === type}
          tooltip={i18n.__('filter')}
          tooltipPosition={tooltipPosition}
          tooltipStyles={tooltipStyles}
        >
          <FilterIcon />
        </IconButton>
        <Popover
          open={open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleRequestClose}
        >
          <div className="filter-form">
            {this.renderFilterForm()}
          </div>
        </Popover>
      </span>
    );
  }
}

FilterButton.propTypes = {
  disable: PropTypes.string,
  type: PropTypes.string,
  field: PropTypes.string,
  iconStyle: PropTypes.object,
  buttonStyle: PropTypes.object,
  tooltipStyles: PropTypes.object,
  tooltipPosition: PropTypes.string,
  filters: PropTypes.array,
  updateCurrentField: PropTypes.func,
};

export default FilterButton;
