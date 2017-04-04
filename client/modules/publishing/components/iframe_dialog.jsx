import React, { PropTypes } from 'react';
import { RaisedButton, Dialog, TextField, Divider,
  Subheader, IconButton, FlatButton } from 'material-ui';
import Loading from '/client/modules/core/components/partial/loading.jsx';
import CopyIcon from 'material-ui/svg-icons/content/content-copy';
import { grey600 } from 'material-ui/styles/colors';
import i18n from 'meteor/universe:i18n';
import { defaultChartIframeSize } from '/lib/constants';
import getIframe from './iframe_generator';

const styles = {
  dialog: {
    content: {
      width: '50%',
      maxWidth: 'none',
    },
    body: {
      padding: '0 24px',
      minHeight: '200px',
    },
  },
  unpublishButton: {
    position: 'absolute',
    top: '20px',
    right: '30px',
  },
  copyButton: {
    root: {
      position: 'absolute',
    },
    icon: {
      color: grey600,
    },
  },
  textField: {
    root: {
      border: '1px solid #D6DADC',
      borderRadius: '2px',
      backgroundColor: '#F8F9F9',
      borderColor: '#E2E4E6',
    },
    input: {
      font: 'small "Courier New", Courier, monospace',
      padding: '1px 3px',
      margin: '-5px 2px',
    },
  },
  iframeSubheader: {
    padding: 0,
  },
  linkSubheader: {
    padding: 0,
    marginTop: '15px',
    marginBottom: '-15px',
  },
};

class IframeDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      iframe: '',
    };
    this.handlePublications = this.handlePublications.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.open && !this.props.isPublished) {
      this.handlePublications();
    }
    if (nextProps.link) {
      this.setState({
        iframe: getIframe({
          src: nextProps.link,
          width: defaultChartIframeSize.defaultWidth,
          height: defaultChartIframeSize.defaultHeight,
        }),
      });
    }
  }
  handlePublications() {
    const { setIsPublished, chartId, isPublished, handleIframeDialog } = this.props;
    setIsPublished(chartId, !isPublished);
    if (isPublished) handleIframeDialog();
  }
  render() {
    const { handleIframeDialog, copyTextToClipboard, link, isPublished } = this.props;
    return (
      <Dialog
        title={i18n.__('chart_is_public')}
        actions={[<FlatButton label={i18n.__('close')} primary onTouchTap={handleIframeDialog} />]}
        contentStyle={styles.dialog.content}
        bodyStyle={styles.dialog.body}
        open={this.props.open}
        onRequestClose={handleIframeDialog}
      >
        <RaisedButton
          style={styles.unpublishButton}
          primary
          label="Make privat"
          onTouchTap={this.handlePublications}
        />
        {isPublished
          ? <div >
            <Subheader style={styles.iframeSubheader}>
              Iframe
              <IconButton
                tooltip={i18n.__('copy_code')}
                tooltipPosition="top-center"
                style={styles.copyButton.root}
                iconStyle={styles.copyButton.icon}
                onTouchTap={() => copyTextToClipboard(this.state.iframe)}
              >
                <CopyIcon />
              </IconButton>
            </Subheader>
            <TextField
              id="publishing-iframe-text"
              style={styles.textField.root}
              inputStyle={styles.textField.input}
              onChange={(e, v) => this.setState({ iframe: v })}
              underlineShow={false}
              defaultValue={this.state.iframe}
              fullWidth
              multiLine
              rowsMax={6}
            />
            <Divider />
            <Subheader style={styles.linkSubheader}>
              Link
              <IconButton
                tooltip={i18n.__('copy_link')}
                tooltipPosition="top-center"
                style={styles.copyButton.root}
                iconStyle={styles.copyButton.icon}
                onTouchTap={() => copyTextToClipboard(link)}
              >
                <CopyIcon />
              </IconButton>
            </Subheader>
            <TextField
              id="publishing-link-text"
              value={link}
              fullWidth
            />
          </div>
          : <Loading />}
      </Dialog>
    );
  }
}

IframeDialog.propTypes = {
  chartId: PropTypes.string.isRequired,
  isPublished: PropTypes.bool.isRequired,
  link: PropTypes.string,
  open: PropTypes.bool,
  handleIframeDialog: PropTypes.func,
  setIsPublished: PropTypes.func,
  copyTextToClipboard: PropTypes.func,
};

export default IframeDialog;
