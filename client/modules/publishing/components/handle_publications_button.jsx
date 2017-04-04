import React, { PropTypes } from 'react';
import PublicIcon from 'material-ui/svg-icons/social/public';
import IconButton from 'material-ui/IconButton';
import i18n from 'meteor/universe:i18n';
import IframeDialog from '../containers/iframe_dialog';
import { cyan500, grey800 } from 'material-ui/styles/colors';

class HandlePublicationsButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iframeDialogOpen: false,
    };
    this.handleIframeDialog = this.handleIframeDialog.bind(this);
  }
  handleIframeDialog() {
    this.setState({
      iframeDialogOpen: !this.state.iframeDialogOpen,
    });
  }
  render() {
    const { styles, chartId, isPublished } = this.props;
    return (
      <div style={styles ? styles.root : null}>
        <IframeDialog
          open={this.state.iframeDialogOpen}
          handleIframeDialog={this.handleIframeDialog}
          chartId={chartId}
          isPublished={isPublished}
        />
        <IconButton
          tooltip={i18n.__(isPublished ? 'settings_publication' : 'publish')}
          tooltipStyles={styles ? styles.toolTip : null}
          tooltipPosition={isPublished ? 'bottom-left' : 'bottom-center'}
          onTouchTap={this.handleIframeDialog}
          iconStyle={styles ? styles.icon : null}
          children={<PublicIcon color={isPublished ? cyan500 : grey800} />}
        />
      </div>
    );
  }
}

HandlePublicationsButton.propTypes = {
  chartId: PropTypes.string.isRequired,
  isPublished: PropTypes.bool.isRequired,
  styles: PropTypes.object,
};

export default HandlePublicationsButton;
