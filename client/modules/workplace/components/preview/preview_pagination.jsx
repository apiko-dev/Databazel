import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import TextField from 'material-ui/TextField';
import T from '/lib/i18n';

const style = {
  selectField: {
    width: '40px',
    fontSize: '14px',
  },
};

class PreviewPagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = { limit: props.pagination.limit };
    this.submitLimit = this.submitLimit.bind(this);
    this.nextData = this.nextData.bind(this);
    this.preData = this.preData.bind(this);
    this.handelChangeLimit = this.handelChangeLimit.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    const { limit } = this.props.pagination;
    const nextLimit = nextProps.pagination.limit;
    if (limit !== nextLimit && this.state.limit !== nextLimit) {
      this.setState({ limit: nextLimit });
    }
  }
  handelChangeLimit(e) {
    this.setState({ limit: e.currentTarget.value });
  }
  submitLimit() {
    const pagination = { page: 1, limit: this.state.limit };
    this.props.updateSQLQueryObj({ pagination });
  }
  nextData() {
    const { pagination } = this.props;
    const newPagination = {
      limit: pagination.limit,
      page: ++pagination.page,
    };
    this.props.updateSQLQueryObj({ pagination: newPagination });
  }
  preData() {
    const { pagination } = this.props;
    if (pagination.page < 2) return;
    const newPagination = {
      limit: pagination.limit,
      page: --pagination.page,
    };
    this.props.updateSQLQueryObj({ pagination: newPagination });
  }
  render() {
    const { pagination, itemsCount } = this.props;
    const { limit } = this.state;
    const skip = (pagination.page - 1) * pagination.limit;
    return (
      <div className="preview-pagination text-muted">
        <div className="action-pagination">
          <IconButton
            onTouchTap={this.preData}
            disabled={pagination.page === 1}
          >
            <ArrowLeft />
          </IconButton>

          <IconButton
            onTouchTap={this.nextData}
            disabled={pagination.limit > itemsCount}
          >
            <ArrowRight />
          </IconButton>
        </div>

        <div className="text-pagination">
          {skip + 1}-{skip + itemsCount}
        </div>

        <div className="action-pagination">
          <TextField
            name="pagination"
            value={limit}
            onChange={this.handelChangeLimit}
            onBlur={this.submitLimit}
            style={style.selectField}
          />
        </div>

        <div className="text-pagination">
          <T>rows_per_page</T>
        </div>
      </div>
    );
  }
}

PreviewPagination.propTypes = {
  pagination: PropTypes.object,
  itemsCount: PropTypes.number,
  updateSQLQueryObj: PropTypes.func,
};

export default PreviewPagination;
