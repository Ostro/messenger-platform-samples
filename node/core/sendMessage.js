const callSendAPI = require('./callSendAPI');

/*
 * Send a message with Quick Reply buttons.
 *
 */
module.exports = (recipientId, message) => callSendAPI({
  recipient: {
    id: recipientId
  },
  message
});
