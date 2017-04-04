import { Meteor } from 'meteor/meteor';
import itemShareLetter from './email_templates/itemShareLetter';

const getItemShareLetterOptions = ({ itemId, itemType, itemName, chartsNames }) => {
  const from = 'Databazel Accounts <m.striletskyi@databazel.com>';
  const subject = `You have a new ${itemType} available`;
  const rootUrl = Meteor.absoluteUrl();
  const html = itemShareLetter({
    url: `${rootUrl}${itemType}/${itemId}`,
    itemType,
    itemName,
    chartsNames,
  });

  return {
    from,
    subject,
    html,
  };
};
export default getItemShareLetterOptions;
