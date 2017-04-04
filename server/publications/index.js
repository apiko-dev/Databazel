import users from './users';
import dashboards from './dashboards';
import charts from './charts';
import chartsLocations from './chartsLocations';

export default () => {
  dashboards();
  charts();
  chartsLocations();
  users();
};
