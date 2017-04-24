const express = require('express');
const config  = require('config');

const receivers = require('../core/receivers');
const configHelper = require('../core/helpers/getFacebookConf');

module.exports = () => {
  const webhook = express.Router();
  /*
   * Use your own validation token. Check that the token used in the Webhook
   * setup is the same token used here.
   *
   */
  webhook.get('/', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === configHelper.getValidationToken()) {
      console.log("Validating webhook");
      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error("Failed validation. Make sure the validation tokens match.");
      res.sendStatus(403);
    }
  });

  /*
   * All callbacks for Messenger are POST-ed. They will be sent to the same
   * webhook. Be sure to subscribe your app to your page to receive callbacks
   * for your page.
   * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
   *
   */
  webhook.post('/', (req, res) => {
    console.log('post sur webhook');
    const data = req.body;

    // Make sure this is a page subscription
    if (data.object === 'page') {
      // Iterate over each entry
      // There may be multiple if batched
      data.entry.forEach((pageEntry) => {
        // Iterate over each messaging event
        pageEntry.messaging.forEach((messagingEvent) => {
          console.log('messagingEvent', messagingEvent);
          if (messagingEvent.optin) {
            receivers.receivedAuthentication(messagingEvent);
          } else if (messagingEvent.message) {
            receivers.receivedMessage(messagingEvent);
          } else if (messagingEvent.delivery) {
            receivers.receivedDeliveryConfirmation(messagingEvent);
          } else if (messagingEvent.postback) {
            receivers.receivedPostback(messagingEvent);
          } else if (messagingEvent.read) {
            receivers.receivedMessageRead(messagingEvent);
          } else if (messagingEvent.account_linking) {
            receivers.receivedAccountLink(messagingEvent);
          } else {
            console.log("Webhook received unknown messagingEvent: ", messagingEvent);
          }
        });
      });

      // Assume all went well.
      //
      // You must send back a 200, within 20 seconds, to let us know you've
      // successfully received the callback. Otherwise, the request will time out.
      return res.sendStatus(200);
    }
    res.sendStatus(400);
  });

  return webhook;
};
