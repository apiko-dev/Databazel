import { Meteor } from 'meteor/meteor';

export default () => {
  Meteor.publish('user', function () {
    return Meteor.users.find(
      { _id: this.userId },
      { fields: { isAdmin: 1 } }
    );
  });
  Meteor.publish('users', function () {
    const fields = { emails: 1 } ;
    if (Meteor.users.findOne(this.userId).isAdmin) fields.isAdmin = 1;
    return Meteor.users.find({}, { fields });
  });
};
