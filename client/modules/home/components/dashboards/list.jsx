import React, { PropTypes } from 'react';
import i18n from 'meteor/universe:i18n';
import Formsy from 'formsy-react';
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import ContentAdd from 'material-ui/svg-icons/content/add';
import DashboardItem from './item.jsx';
import { CardText, Card } from 'material-ui/Card';
import { grey400 } from 'material-ui/styles/colors';


const styles = {
  card: {
    container: {
      width: '100%',
      height: '75%',
    },
  },
  newDashboard: {
    plus: {
      root: {
        display: 'block',
        margin: 'auto',
        marginBottom: '16%',
        width: '40%',
        height: '40%',
        cursor: 'pointer',
      },
    },
  },
  dashboardName: {
    container: {
      root: {
        position: 'absolute',
        width: '98%',
        marginTop: '-90px',
      },
    },
    input: {
      root: {
        fontSize: '1.3em',
      },
    },
  },
};

class DashboardsList extends React.Component {
  constructor() {
    super();
    this.submitCreateDashboard = this.submitCreateDashboard.bind(this);
    this.handlePlusIconTouched = this.handlePlusIconTouched.bind(this);
  }
  handlePlusIconTouched() {
    const { form, dashboardName } = this.refs;
    if (dashboardName.getValue() === '') {
      dashboardName.focus();
    } else {
      form.submit();
    }
  }
  submitCreateDashboard(model) {
    const { meteorMethodCall, routeTo } = this.props;
    meteorMethodCall('dashboard.create', { name: model.dashboardName }, (err, dashboardId) => {
      if (!err) routeTo('dashboard', { dashboardId });
    });
  }

  render() {
    const { dashboards, isLoading, routeTo, meteorMethodCall } = this.props;
    return (
      <div className="dashboard-cards row">
        {dashboards && dashboards.map(dashboard => (
          <div
            className="col-xs-12 col-sm-6 col-md-4 col-lg-3"
            key={dashboard._id}
          >
            <DashboardItem
              dashboard={dashboard}
              routeTo={routeTo}
              meteorMethodCall={meteorMethodCall}
            />
          </div>
        ))}
        {isLoading ? '' :
          <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <Card style={styles.card.container}>
              <ContentAdd
                style={styles.newDashboard.plus.root}
                color={grey400}
                onTouchTap={this.handlePlusIconTouched}
              />
              <CardText style={styles.dashboardName.container.root}>
                <Formsy.Form onValidSubmit={this.submitCreateDashboard} ref="form">
                  <FormsyText
                    name="dashboardName"
                    fullWidth
                    floatingLabelText={i18n.__('type_name_of_new_dashboard')}
                    style={styles.dashboardName.input.root}
                    required
                    className="newDashboardName"
                    ref="dashboardName"
                  />
                </Formsy.Form>
              </CardText>
            </Card>
          </div>
        }
      </div>

    );
  }
}

DashboardsList.propTypes = {
  dashboards: PropTypes.array,
  routeTo: PropTypes.func.isRequired,
  meteorMethodCall: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default DashboardsList;
