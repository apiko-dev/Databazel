import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';

const DialogBasic = ({ message, title, onRequestClose, getActions, open }) => (
  message ? (
    <Dialog
      title={title || 'Error'}
      actions={getActions()}
      modal={false}
      open={open}
      onRequestClose={onRequestClose}
    >
      {message}
    </Dialog>
  )
    : null
);

DialogBasic.propTypes = {
  message: PropTypes.string,
  title: PropTypes.string,
  onRequestClose: PropTypes.func,
  getActions: PropTypes.func,
  open: PropTypes.bool,
};

export default DialogBasic;
