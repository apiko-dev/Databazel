import React, { PropTypes } from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import DoneIcon from 'material-ui/svg-icons/action/done';

const styles = {
  menuItem: {
    padding: '0 8px',
  },
};

class BooleanFilter extends React.Component {
  constructor(props) {
    super(props);
    this.updateFilters = this.updateFilters.bind(this);
  }
  updateFilters(e, value) {
    const filter = this.props.filtersData !== value ? value : null;
    this.props.updateFilters(filter);
    this.props.closePopover();
  }
  render() {
    const { filtersData } = this.props;
    return (
      <Menu onChange={this.updateFilters}>
        <MenuItem
          value="true"
          primaryText="true"
          rightIcon={filtersData === 'true' ? <DoneIcon /> : null}
          innerDivStyle={styles.menuItem}
        />
        <MenuItem
          value="false"
          primaryText="false"
          rightIcon={filtersData === 'false' ? <DoneIcon /> : null}
          innerDivStyle={styles.menuItem}
        />
      </Menu>
    );
  }
}

BooleanFilter.propTypes = {
  filtersData: PropTypes.string,
  updateFilters: PropTypes.func,
  closePopover: PropTypes.func,
};

export default BooleanFilter;
