const config = require('config');

// App Secret can be retrieved from the App Dashboard
const getAppSecret = () => (process.env.MESSENGER_APP_SECRET) ?
  process.env.MESSENGER_APP_SECRET :
  config.get('appSecret')
;

// Arbitrary value used to validate a webhook
const getValidationToken = () => (process.env.MESSENGER_VALIDATION_TOKEN) ?
  (process.env.MESSENGER_VALIDATION_TOKEN) :
  config.get('validationToken')
;

// Generate a page access token for your page from the App Dashboard
const getPageAccessToken = () => (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
  (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken')
;

// URL where the app is running (include protocol). Used to point to scripts and
// assets located at this address.
const getServerUrl = () => (process.env.SERVER_URL) ?
  (process.env.SERVER_URL) :
  config.get('serverURL')
;

module.exports = {
  getAppSecret,
  getValidationToken,
  getPageAccessToken,
  getServerUrl
};
