'use strict';

const express = require('express');
const {
  GetMedia,
  NewMedia
} = require('../controllers/media');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const { ensureAuth } = require('../middlewares/authenticated');

const api = express.Router();

api
  .get('/medias', GetMedia)
  .post('/media', multipartMiddleware, ensureAuth, NewMedia);
  // .post('/media', NewMedia);

module.exports = api;
