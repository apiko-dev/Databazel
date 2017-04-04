import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import FlatButton from 'material-ui/FlatButton';
import FormsyCheckbox from 'formsy-material-ui/lib/FormsyCheckbox';
import Formsy from 'formsy-react';
import { _ } from 'meteor/underscore';

const styles = {
  collectionsBtn: {
    width: '100%',
    textAlign: 'left',
  },
  labelStyle: {
    textTransform: 'none',
    overflow: 'hidden',
    display: 'block',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    padding: '0 10px',
  },
};

class CollectionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedCollections: false };
    this.submitSelectedCollections = this.submitSelectedCollections.bind(this);
    this.selectCollection = this.selectCollection.bind(this);
    this.resetConstructor = this.resetConstructor.bind(this);
  }
  submitSelectedCollections() {
    const selectedCollections = this.state.selectedCollections;
    this.props.setSQLQueryObj({
      from: selectedCollections[0],
      join: selectedCollections[1],
    });
    this.props.changeCollectionState(false);
  }
  selectCollection(model) {
    const selectedCollections = _.compact(_.map(model, (item, key) => item && key));
    this.setState({ selectedCollections });
  }
  resetConstructor() {
    const { setSQLQueryObj, togglePreview, changeCollectionState } = this.props;
    setSQLQueryObj();
    changeCollectionState(true);
    togglePreview(false);
    this.setState({ selectedCollections: false });
  }
  render() {
    const { error, collections, isCollectionsOpen } = this.props;
    const { selectedCollections } = this.state;
    if (!collections) return null;
    return (
      <div
        className="collections-list-container"
        style={isCollectionsOpen ? { height: '100%' } : {}}
      >
        {isCollectionsOpen ?
          <div className="collections-list-wrapper">
            <div className="collections-list sidebar-content">
              <Formsy.Form
                onValidSubmit={this.submitSelectedCollections}
                ref="collectionsForm"
                onChange={this.selectCollection}
              >
                {collections && collections.map((collection, i) => (
                  collection.type === 'file' && collection.name !== 'tmp.res' ?
                    <FormsyCheckbox
                      key={`${collection.name}-${i}`}
                      label={collection.name}
                      name={collection.name}
                      disabled={
                      selectedCollections.length >= 2 &&
                      !~selectedCollections.indexOf(collection.name)
                    }
                    /> : ''
                ))}
                <div className="actions-btn">
                  <FlatButton
                    type="submit"
                    label="Submit"
                    primary
                    keyboardFocused
                  />
                </div>
              </Formsy.Form>
            </div>
          </div>
          :
          <div className="sidebar-header">
            <FlatButton
              style={styles.collectionsBtn}
              labelStyle={styles.labelStyle}
              className="clip"
              label={i18n.__('change_collections')}
              onTouchTap={this.resetConstructor}
              disabled={error}
            />
          </div>
        }
      </div>
    );
  }
}

CollectionList.propTypes = {
  isCollectionsOpen: PropTypes.bool,
  collections: PropTypes.array,
  error: PropTypes.object,
  setSQLQueryObj: PropTypes.func,
  changeCollectionState: PropTypes.func,
  togglePreview: PropTypes.func,
};

export default CollectionList;
