import React from 'react';
import ReactDOMServer from 'react-dom/server';
import SimpleEmail from './parts/mainLayout';
import Charts from './parts/charts';


const itemShareLetter = ({ itemType, url, itemName, chartsNames }) => {
  const header = `Somebody just shared with you a ${itemType} called "${itemName}" on Databazel.
                  Click on the button below to see.`;
  const buttonText = 'Go to Databazel';
  const parts = {
    header,
    buttonText,
    url,
    additionalLink: true,
  };
  return ReactDOMServer.renderToStaticMarkup(
    <SimpleEmail {...parts}>
      {chartsNames ? <Charts chartsNames={chartsNames} /> : ''}
    </SimpleEmail>);
};
export default itemShareLetter;
