/*
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* jshint node: true, devel: true */
'use strict';

const bodyParser   = require('body-parser');
const crypto       = require('crypto');
const express      = require('express');
const request      = require('request');
const api          = require('./api');
const configHelper = require('./core/helpers/getFacebookConf');

/*
 * Be sure to setup your config values before running this code. You can
 * set them using environment variables or modifying the config file in /config.
 *
 */
if (!(configHelper.getAppSecret() && configHelper.getValidationToken() &&
  configHelper.getPageAccessToken() && configHelper.getServerUrl())) {
  console.error("Missing config values");
  process.exit(1);
}

/*
 * Verify that the callback came from Facebook. Using the App Secret from
 * the App Dashboard, we can verify the signature that is sent with each
 * callback in the x-hub-signature field, located in the header.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks#setup
 *
 */
const verifyRequestSignature = (req, res, buf)  => {
  const signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    const elements = signature.split('=');
    const signatureHash = elements[1];

    const expectedHash = crypto.createHmac('sha1', configHelper.getAppSecret())
      .update(buf)
      .digest('hex');

    if (signatureHash !== expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

const app = express();
app.set('port', process.env.PORT || 5000);
app.set('view engine', 'ejs');
app.use(bodyParser.json({ verify: verifyRequestSignature }));
app.use(express.static('public'));
app.use(api());

// Start server
// Webhooks must be available via SSL with a certificate signed by a valid 
// certificate authority.
app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;
