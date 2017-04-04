import React, { PropTypes } from 'react';
import Formsy from 'formsy-react';
import FormsyDate from 'formsy-material-ui/lib/FormsyDate';
import FlatButton from 'material-ui/FlatButton';
import FormsyTime from 'formsy-material-ui/lib/FormsyTime';

const style = {
  date: {
    width: '100px',
  },
  resetBtn: {
    display: 'block',
    margin: '0 auto',
  },
};

class DateFilter extends React.Component {
  constructor(props) {
    super(props);
    this.updateFilters = this.updateFilters.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }
  updateFilters(model) {
    if (model.fromDate || model.toDate) {
      this.props.updateFilters(model);
    }
  }
  resetForm() {
    this.refs.filterForm.reset();
    this.props.updateFilters();
  }
  render() {
    const { filtersData } = this.props;
    return (
      <Formsy.Form
        onSubmit={this.updateFilters}
        ref="filterForm"
      >
        <div className="date-filter-item">
          <span>From</span>
          <FormsyDate
            name="fromDate"
            value={filtersData && filtersData.fromDate}
            hintText="yyyy-mm-dd"
            textFieldStyle={style.date}
            autoOk
          />
          <FormsyTime
            name="fromTime"
            value={filtersData && filtersData.fromTime}
            hintText="hh:mm"
            textFieldStyle={style.date}
            format="24hr"
            autoOk
          />
        </div>
        <div className="date-filter-item">
          <span>To</span>
          <FormsyDate
            name="toDate"
            value={filtersData && filtersData.toDate}
            hintText="yyyy-mm-dd"
            textFieldStyle={style.date}
            autoOk
          />
          <FormsyTime
            name="toTime"
            value={filtersData && filtersData.toTime}
            hintText="hh:mm"
            textFieldStyle={style.date}
            format="24hr"
            autoOk
          />
        </div>
        <FlatButton
          label="Reset"
          onTouchTap={this.resetForm}
          style={style.resetBtn}
          type="reset"
        />
      </Formsy.Form>
    );
  }
}

DateFilter.propTypes = {
  filtersData: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  updateFilters: PropTypes.func,
};

export default DateFilter;
