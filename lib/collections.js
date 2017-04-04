import { Mongo } from 'meteor/mongo';
import { chartsSchema, dashboardsSchema, chartsLocationsSchema } from './schemas/';

const Charts = new Mongo.Collection('charts');
const Dashboards = new Mongo.Collection('dashboards');
const ChartsLocations = new Mongo.Collection('chartsLocations');

Dashboards.attachSchema(dashboardsSchema);
ChartsLocations.attachSchema(chartsLocationsSchema);
// Charts.attachSchema(chartsSchema);  // TODO Oleg: add Charts Schema

export { Charts, Dashboards, ChartsLocations };
