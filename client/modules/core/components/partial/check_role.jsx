import React, { PropTypes } from 'react';

class CheckRole extends React.Component {
  componentDidMount() {
    const { redirectToLogin, onlyAdmin } = this.props;
    redirectToLogin(onlyAdmin);
  }
  render() {
    const { children, canRender } = this.props;
    if (canRender) return children;
    return <i></i>;
  }
}

CheckRole.propTypes = {
  canRender: PropTypes.bool,
  onlyAdmin: PropTypes.bool,
  children: PropTypes.element,
  redirectToLogin: PropTypes.func,
};

export default CheckRole;
