import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Layout from './layout.jsx';
import { grey800 } from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  zIndex: {
    layer: 1500,
  },
  palette: {
    textColor: grey800,
  },
  appBar: {
    height: 50,
  },
});

const MainLayout = ({ content = () => null }) => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <Layout content={content()} />
  </MuiThemeProvider>
);

MainLayout.propTypes = {
  content: React.PropTypes.func,
};

export default MainLayout;
