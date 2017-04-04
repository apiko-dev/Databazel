import React from 'react';
import Navigation from '../containers/navigation';
import generateLinks from './partial/generateLinks';
import SnackbarMessage from '../containers/notifications/snackbar_message';
import DialogInteraction from '../containers/notifications/dialog_interaction';
import DialogImportant from '../containers/notifications/dialog_important';

class Layout extends React.Component {
  componentDidMount() {
    generateLinks();
  }
  render() {
    const { content } = this.props;
    return (
      <div className="main-layout">
        <SnackbarMessage />
        <DialogInteraction />
        <DialogImportant />
        <div className="blackout">
        </div>
        <header>
          <Navigation />
        </header>
        <section className="row main-container">
          <div className="col-xs-12">
            {content}
          </div>
        </section>
        <footer>
        </footer>
      </div>
    );
  }
}

Layout.propTypes = {
  content: React.PropTypes.element,
};

export default Layout;
