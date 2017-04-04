import React, { PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';

const Loading = ({ centered, preview }) => (
  <div
    className={
      `loading ${centered ? 'loading-centered' : ''} ${preview ? 'loading-preview' : ''}`
      }
  >
    <CircularProgress />
  </div>
);

Loading.propTypes = {
  centered: PropTypes.bool,
  preview: PropTypes.bool,
};

export default Loading;
