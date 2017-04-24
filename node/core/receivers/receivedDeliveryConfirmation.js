/*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a message. Read more about
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
 *
 */
module.exports = (event) => {
  const delivery = event.delivery;
  const messageIDs = delivery.mids;
  const watermark = delivery.watermark;

  if (messageIDs) {
    messageIDs.forEach((messageID) => {
      console.log("Received delivery confirmation for message ID: %s",
        messageID);
    });
  }

  console.log("All message before %d were delivered.", watermark);
};
