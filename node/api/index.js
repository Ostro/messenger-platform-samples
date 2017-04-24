const express = require('express');

const authorize = require('./authorize');
const webhook = require('./webhook');

module.exports = () => {
  const api = new express.Router();

  api.use('/authorize', authorize());
  api.use('/webhook', webhook());

  return api;
};
