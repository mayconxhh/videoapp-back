const jwt = require('jwt-simple');
const moment = require('moment');

exports.ensureAuth = function(req, res, next){

	if (!req.headers.authorization) {
		return res
							.status(403)
							.send({
								message: 'La petición no tiene cabecera de autenticación.'
							});
	}

	let tk = req.headers.authorization.replace(/['"]+/g, '');

	try{
	
		var payload = jwt.decode(tk, process.env.SECRET);

		if (payload.exp <= moment().unix()) {

			return res
								.status(401)
								.send({
									message: 'El token ha expirado.'
								});

		}
	}catch(ex){

		return res
							.status(404)
							.send({
								message: 'El token no es válido.'
							});

	}

	req.user = payload;

	next();
}