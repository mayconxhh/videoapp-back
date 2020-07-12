'use strict';

const express = require('express');
const {
  GetMedia,
  GetMedias,
  NewMedia
} = require('../controllers/media');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const { ensureAuth } = require('../middlewares/authenticated');

const api = express.Router();

api
  .get('/media/:id', GetMedia)
  .get('/medias', GetMedias)
  .post('/media', multipartMiddleware, ensureAuth, NewMedia);
  // .post('/media', NewMedia);

module.exports = api;
