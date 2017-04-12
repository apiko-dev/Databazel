import React, { PropTypes } from 'react';
import MenuItem from 'material-ui/MenuItem';
import ImageIcon from 'material-ui/svg-icons/image/image';
import CircularProgress from 'material-ui/CircularProgress';
import { grey600 } from 'material-ui/styles/colors';
import i18n from 'meteor/universe:i18n';
import ImageRenderer from '/client/modules/core/containers/export_to_image/image_renderer';

class ExportImageMenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  render() {
    const { iconStyle, dashboardName, chartsId } = this.props;
    return (
      <MenuItem
        primaryText={i18n.__(dashboardName ? 'export_images' : 'export_image')}
        onTouchTap={() => this.setState({ isLoading: true })}
        disabled={this.state.isLoading}
        id="export-image-menu-item"
        leftIcon={!this.state.isLoading ?
          <ImageIcon color={iconStyle ? iconStyle.color : grey600} />
          :
          <div>
            <CircularProgress size={20} />
            <ImageRenderer
              chartsId={chartsId}
              dashboardName={dashboardName}
              handleRenderFinished={() => this.setState({ isLoading: false })}
            />
          </div>
        }
      />
    );
  }
}

ExportImageMenuItem.propTypes = {
  chartsId: PropTypes.array,
  dashboardName: PropTypes.string,
  iconStyle: PropTypes.object,
};

export default ExportImageMenuItem;
