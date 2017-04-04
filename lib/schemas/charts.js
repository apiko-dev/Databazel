import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default new SimpleSchema({
  chartName: {
    type: String,
  },
  chartType: {
    type: String,
  },
  query: {
    type: String,
  },
  data: {
    type: [Object],
  },
  pagination: {
    type: Object,
  },
  dataTimeStamp: {
    type: Number,
    optional: true,
  },
  queryObject: {
    type: Object,
  },
  database: {
    type: Object,
  },
  autorefresh: {
    type: Boolean,
    defaultValue: false,
  },
  isPublished: {
    type: Boolean,
    defaultValue: false,
  },
});
