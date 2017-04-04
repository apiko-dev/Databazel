import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import ImageIcon from 'material-ui/svg-icons/image/image';
import CircularProgress from 'material-ui/CircularProgress';
import { grey600 } from 'material-ui/styles/colors';
import i18n from 'meteor/universe:i18n';
import ImageRenderer from '/client/modules/core/containers/export_to_image/image_renderer';

class ExportImageButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  render() {
    const { buttonStyles, tooltipStyles, iconStyle, dashboardName, chartsId } = this.props;
    return (
      <div style={{ display: 'inline-block' }} >
        {!this.state.isLoading ?
          <IconButton
            style={buttonStyles}
            tooltipStyles={tooltipStyles}
            tooltip={i18n.__(dashboardName ? 'export_images' : 'export_image')}
            tooltipPosition={'bottom-center'}
            iconStyle={{ iconStyle }}
            onTouchTap={() => this.setState({ isLoading: true })}
          >
            <ImageIcon color={iconStyle ? iconStyle.color : grey600} />
          </IconButton>
        :
          <div>
            <CircularProgress size={0.4} />
            <ImageRenderer
              chartsId={chartsId}
              dashboardName={dashboardName}
              handleRenderFinished={() => this.setState({ isLoading: false })}
            />
          </div>
        }
      </div>
      );
  }
}

ExportImageButton.propTypes = {
  chartsId: PropTypes.array,
  dashboardName: PropTypes.string,
  buttonStyles: PropTypes.object,
  tooltipStyles: PropTypes.object,
  iconStyle: PropTypes.object,
};

export default ExportImageButton;
