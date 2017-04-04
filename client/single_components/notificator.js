/**
  Class that can be used to conveniently include notification
  about successful action or errors into your app

  Can be used inside Actions.

  Will be rendered in the main layout of the add
  from which action was called.

    @example success
      notifyChartShared(context, ...something ) {
        { Notificator } = context();
        const message = 'Chart shared successfully';
        const status = 'positive';
        Notificator.snackbar(message, status);
     }

    @example important
      notifyAboutSomethingImportant(context, ...something ) {
        { Notificator } = context();
        const message = 'This is important',
        const title = 'WARNING!!!', // optional
        Notificator.important(message, title);
      }

    @example interaction
      notifyWithInteraction(context, ...something ){
        { Notificator } = context();
        const message = 'Choose actions'
        const options = { //  all arguments are optional
          confirmFunction(){do something on confirm},
          confirmLabel: 'text value for confirm button',
          confirmFunction(){do something on cancel},
          cancelLabel: 'text value for cancel button',
          title: 'title to the dialog'
        }
        Notificator.interaction (message, options);
   }
*/

class Notificator {
  /**
   * constructor
   * @param {object} LocalState
   */
  constructor(LocalState) {
    this.LocalState = LocalState;
    this.interactionOptions = {};
  }

  /**
   * opens a snackbar with a message for user
   * @param {string} message - text to show to user
   * @param {string} status - ['positive', 'negative', 'neutral'] express style of snackbar
   */
  snackbar(message, status) {
    if (message) this.LocalState.set('SNACKBAR_MESSAGE', { message, status });
  }

  /**
   * opens a material ui dialog to notify user about important event
   * @param {string} message - text to notify about important event
   * @param {string} [title=Error] - text to be displayed as dialog title
   */
  important(message, title) {
    this.LocalState.set('DIALOG_IMPORTANT', { message, title });
  }

  /**
   * opens a material ui dialog with two options
   * can be used when some action from user is needed
   * @param {string} message - text to render
   * @param {object} [options] - object with parameters for dialog
   * @param {function} options.confirmFunction - function that will
   * be called when right button is pressed
   * @param {string} options.confirmLabel - text on the right button
   * @param {function} options.cancelFunction   - function that will
   * be called when left button is pressed
   * @param {string} options.cancelLabel - text on the left button
   * @param {string} options.title - text to be displayed as a dialog title
   */
  interaction(message, options) {
    this.interactionOptions = options || this.interactionOptions;
    this.LocalState.set('DIALOG_INTERACTION', message);
  }
}
export default Notificator;
