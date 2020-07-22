'use strict'

const jwt = require('jwt-simple');
const moment = require('moment');

exports.createToken = function(user){
	let payload = {
		sub: user._id,
		name: user.name,
		lastname: user.lastname,
		nick: user.nick,
		email: user.email,
		role: user.role,
		file: user.file,
		iat: moment().unix(),
		exp: moment().add(17, 'days').unix()
	}

	return jwt.encode(payload, process.env.SECRET);
}