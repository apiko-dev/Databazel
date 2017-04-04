import React, { PropTypes } from 'react';
import ReactDOMServer from 'react-dom/server';

const styles = {
  display: 'block',
  background: '#000',
  border: 'none',
};

const Iframe = ({ src, width, height }) => (
  <iframe
    src={src}
    scrolling="no"
    width={width || '500px'}
    height={height || '250px'}
    style={styles}
  />
);

Iframe.propTypes = {
  src: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

const getIframe = (args) => (
  ReactDOMServer.renderToStaticMarkup(<Iframe {...args} />)
);

export default getIframe;
