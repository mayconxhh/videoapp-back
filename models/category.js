'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = Schema({
	name: { type: String },
	description: { type: String }
});

module.exports = mongoose.model('Category', CategorySchema);