import quasar from './quasar';
import charts from './charts';
import chartsLocations from './chartsLocations';
import dashboard from './dashboard';
import accounts from './accounts';
import exportCsv from './exportCsv';
import users from './users';

export default () => {
  quasar();
  charts();
  chartsLocations();
  dashboard();
  accounts();
  exportCsv();
  users();
};
