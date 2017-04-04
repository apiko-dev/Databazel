import React from 'react';
import IconButton from 'material-ui/IconButton';
import DocsIcon from 'material-ui/svg-icons/action/description';
import i18n from 'meteor/universe:i18n';

const styles = {
  button: {
    cursor: 'pointer',
    left: 10,
  },
  icon: {
    color: 'white',
  },
};

const DocumentsButton = () => (
  <IconButton
    href="http://blog.databazel.com/docs/"
    target="_blank"
    style={styles.button}
    iconStyle={styles.icon}
    tooltip={i18n.__('go_to_documents')}
    tooltipPosition="bottom-left"
  >
    <DocsIcon color="white" />
  </IconButton>
);

export default DocumentsButton;
