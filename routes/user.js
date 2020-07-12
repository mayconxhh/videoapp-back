const express = require('express');

const {
  SaveUser,
	LoginUser,
	GetUser,
	GetUsers,
	UpdateUser
} = require('../controllers/user');

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const api = express.Router();

const { ensureAuth } = require('../middlewares/authenticated');

api
  .post('/new_user', multipartMiddleware, SaveUser)
  .post('/login', multipartMiddleware, LoginUser)
  .get('/user/:id', ensureAuth, GetUser)
  .get('/users', ensureAuth, GetUsers)
  .post('/update_user/:id', multipartMiddleware, ensureAuth, UpdateUser);

module.exports = api;

