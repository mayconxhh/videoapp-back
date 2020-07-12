'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaSchema = Schema({
	name: { type: String },
	description: { type: String },
	date: { type: Date },
	author: { type: Schema.ObjectId, ref: 'User' },
  category: { type: Schema.ObjectId, ref: 'Category', default: null },
	url: { type: String },
	secure_url:  { type: String },
	thumbnail: { type: String },
	secure_thumbnail: { type: String },
	likes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Media', MediaSchema);