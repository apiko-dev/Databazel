import React, { PropTypes } from 'react';

import styles from '../../stylesheets/charts';

const Charts = ({ chartsNames }) => (
  chartsNames && chartsNames.length > 0 ?
    <div>
      <p style={styles.p}>This dashboard contains the following charts: </p>
      <ul style={styles.ul}>
        {chartsNames.map(chart => (<li key={`key_${chart}`}>{chart}</li>))}
      </ul>
    </div>
  : null
);

Charts.propTypes = {
  chartsNames: PropTypes.array,
};

export default Charts;
