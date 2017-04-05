import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import styles from '../../stylesheets/mainLayout';

const SimpleEmail = ({ header, url, buttonText, additionalLink, children }) => (
  <div style={styles.container}>
    <div>
      <div style={styles.mainDiv}>
        <a href={Meteor.absoluteUrl()} target="_blank">
          <img
            src="http://databazel.com/assets/img/logos/databazel.png"
            style={styles.logo}
            alt="Databazel logo"
          />
        </a>
      </div>
      <h5 style={styles.h5}>Hello, </h5>
      <p style={styles.p}>
        {header}
      </p>
        {children}
      <a href={url} style={styles.button} target="_blank">
        {buttonText}
      </a>
      <p style={styles.p}>
        You can also copy and paste the below link
        into your browser address bar.
      </p>
      {additionalLink ?
        <a href={url} style={styles.link} target="_blank">
          <p>{url}</p>
        </a>
          :
        ''
      }
      <p style={styles.thanksP}>
        Thanks,
        <br />
        Databazel Team
      </p>
    </div>
    <div style={styles.bottomDiv}>
      <p>
        You are receiving this email because your address was used for
        creating account on databazel.com website
      </p>
      <p>
        If you hadn't requested account on databazel.com,
        please ignore this email
      </p>
    </div>
  </div>
);

SimpleEmail.propTypes = {
  header: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  children: React.PropTypes.node,
  buttonText: PropTypes.string,
  url: PropTypes.string,
  additionalLink: PropTypes.bool,
};

export default SimpleEmail;
