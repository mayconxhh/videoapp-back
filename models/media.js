'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaSchema = Schema({
	name: { type: String },
	description: { type: String },
	date: { type: Date },
	author: { type: String },
  category: { type: Schema.ObjectId, ref: 'Category', default: null },
  url: { type: String }
});

module.exports = mongoose.model('Media', MediaSchema);