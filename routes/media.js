'use strict';

const express = require('express');
const {
  GetMedia,
  NewMedia
} = require('../controllers/media');
const { UploadMedia } = require('../helpers/UploadMedia');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const api = express.Router();

api
  .get('/media', GetMedia)
  .post('/media', multipartMiddleware, NewMedia);
  // .post('/media', NewMedia);

module.exports = api;
