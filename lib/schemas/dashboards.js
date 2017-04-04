import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default new SimpleSchema({
  name: {
    type: String,
  },
  chartsId: {
    type: [String],
  },
  users: {
    type: [String],
  },
  viewsCounter: {
    type: Number,
  },
});
