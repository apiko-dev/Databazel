import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import { _ } from 'meteor/underscore';

class Icon extends React.Component {
  constructor(props) {
    super(props);
    this.styles = {
      button: {
        padding: 0,
        width: 24,
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        color: 'rgb(66, 66, 66)',
        fill: 'currentcolor',
      },
    };
  }
   
  render() {
    const { tooltip, children, tooltipPosition, styleBtn } = this.props;
    const style = _.isEmpty(styleBtn) ? this.styles.button : _.extend(this.styles.button, styleBtn);
    return (
      <IconButton
        tooltip={tooltip}
        tooltipPosition={tooltipPosition || 'top-right'}
        iconStyle={style}
        style={style}
      >
        {children}
      </IconButton>
    );
  }
}

Icon.propTypes = {
  tooltip: PropTypes.string,
  styleBtn: PropTypes.object,
  children: PropTypes.element,
  tooltipPosition: PropTypes.string,
  style: PropTypes.object,
};

export default Icon;
