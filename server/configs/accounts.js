import { Accounts } from 'meteor/accounts-base';
import getVerifyEmailHtml from '../lib/email/email_templates/enrolmentLetter';

export default () => {
  Accounts.onCreateUser((options, user) => {
    if (options.isAdmin) user.isAdmin = options.isAdmin;
    return user;
  });

  Accounts.emailTemplates.from = 'Databazel Accounts <m.striletskyi@databazel.com>';

  Accounts.emailTemplates.enrollAccount.subject = () => (
    'You have got invitation to Databazel'
  );
  Accounts.emailTemplates.enrollAccount.html = getVerifyEmailHtml;
};
