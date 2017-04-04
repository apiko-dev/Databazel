import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const gMail = Meteor.settings.private.gMail;

Meteor.startup(() => {
  if (gMail && gMail.login && gMail.password) {
    process.env.MAIL_URL = `smtp://${gMail.login}:${gMail.password}@${gMail.host}:${gMail.port}/`;
  }
  const adminEmail = 'admin@admin.com';
  if (!Accounts.users.find({ isAdmin: true }).fetch().length) {
    Accounts.createUser({
      email: adminEmail,
      password: 'admin',
      isAdmin: true,
    });
    const user = Accounts.findUserByEmail(adminEmail);
    Accounts.addEmail(user._id, adminEmail, true);
    console.log('admin added');
  }
});
