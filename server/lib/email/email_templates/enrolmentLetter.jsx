import React from 'react';
import ReactDOMServer from 'react-dom/server';

import SimpleEmail from './parts/mainLayout';
import styles from '../stylesheets/mainLayout';

const VerifyEmail = (user, url) => {
  const header = (
    <span>To start using <a href="http://databazel.com" style={styles.link} target="_blank">Databazel</a>,
    simply click the button:
    </span>);
  const buttonText = 'Confirm Your Account';
  const parts = {
    header,
    buttonText,
    url,
    additionalLink: true,
  };
  return ReactDOMServer.renderToStaticMarkup(<SimpleEmail {...parts} />);
};

export default VerifyEmail;
