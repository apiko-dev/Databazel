import React from 'react';
import IconButton from 'material-ui/IconButton';
import HelpIcon from 'material-ui/svg-icons/action/help';
import i18n from 'meteor/universe:i18n';

const styles = {
  button: {
    cursor: 'pointer',
    left: 7,
  },
  icon: {
    color: 'white',
  },
};

const HelpdeskButton = () => (
  <IconButton
    href="http://helpdesk.databazel.com"
    target="_blank"
    style={styles.button}
    iconStyle={styles.icon}
    tooltip={i18n.__('go_to_helpdesk')}
    tooltipPosition="bottom-left"
  >
    <HelpIcon color="white" />
  </IconButton>
);

export default HelpdeskButton;
