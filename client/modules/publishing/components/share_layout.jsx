import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const ShareLayout = ({ content = () => null }) => (
  <MuiThemeProvider>
    <div className="share-layout" >
      <section className="row">
        <div className="col-xs-12 share-layout">
          {content()}
        </div>
      </section>
    </div>
  </MuiThemeProvider>
);

ShareLayout.propTypes = {
  content: React.PropTypes.func,
};

export default ShareLayout;
