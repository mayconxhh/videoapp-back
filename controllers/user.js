'use strict'

// const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const jwt = require('../services/jwt');
const mongoosePaginate = require('mongoose-pagination');

function SaveUser( req, res ){
	let params = req.body;
  let user = new User();

	if ( params.name && params.lastname && params.nick &&
				params.email && params.password ) {

		user.name = params.name;
		user.lastname = params.lastname;
		user.nick = params.nick;
		user.email = params.email;
		user.role = 'ROLE_USER';
		user.password = params.password;
		user.image = null;

		User.find({ $or: [{ email: user.email.toLowerCase() },
											{ nick: user.nick.toLowerCase() }]})
			.exec((err, users)=>{

				if (err) {
					return res
										.status(500)
										.send({
											success: false,
											message: 'Error al ubicar usuario.',
											err: err
										});
				}

				if (users && users.length >=1 ) {
					return res
										.status(500)
										.send({
											success: false,
											message: 'El nombre de usuario o email ya existe!'
										});
				} else {
					user.save(( err, user )=>{

						if ( err ){
							 return res
							 					.status(500)
							 					.send({
							 						success: false,
							 						message: 'Error al guardar usuario.',
							 						err: err
							 					});
						}

						if ( user ) {
							user.password = undefined;
							res
								.status(200)
								.send({
									success: true,
									user: user,
									message: 'Usuario creado con éxito.'
								});
						} else {
							res
								.status(404)
								.send({
									success: false,
									message: 'No se ha podido crear el usuario'
								});
						}

					});				
				}
			})


	} else {

		res
			.status( 200 )
			.send({
				success: false,
				message: 'Envie todo los campos necesarios!'
			});
	}
}

function LoginUser(req, res){
	let params = req.body;

	let email =params.email;
	let password =params.password;

	User
		.findOne({ email: email })
		.exec((err, user)=>{

			if (err) {
				return res
									.status(500)
									.send({
										success: false,
										message: 'Error al iniciar sesión.',
										err: err
									});
			}

			if (user) {

				var validPassword = user.comparePassword( password );

				if ( validPassword ) {

					let token = jwt.createToken(user);
					user.password = undefined;
					user.__v = undefined;

					res
						.status(200)
						.send({
							success: true,
							message: 'Usuario autenticado!',
							token: token,
							user: user
						});

				} else {

					return res
										.status(404)
										.send({
											success: false,
											message: 'El correo electrónico o la contraseña no son correctos.'
										});
				}
			} else {

				return res
									.status(404)
									.send({
										success: false,
										message: 'La cuenta ingresada no existe.'
									});
			}

		})
}

function GetUser(req, res){
	let user_id = req.params.id;

	User
		.findById( user_id )
		.select('email name lastname image nick role _id ')
		.exec((err, user)=>{

			if (err) {
				return res
									.status(500)
									.send({
										success: false,
										message: 'Error en la petición.',
										err: err
									});
			}

			if (!user) {
				return res
								.status(404)
								.send({
									success: false,
									message: 'El usuario no existe.',
									err: err
								});
      }
      
      return res
              .status(200)
              .send({
                success: true,
                user
              });


		})
}

function GetUsers(req, res){

	let page = 1;

	if ( req.params.page ) {
		page = req.params.page;
	}

	let itemForPage = 10;

	User
		.find()
		.select('email name lastname image nick role _id')
		.paginate( page, itemForPage, (err, users, total)=>{

			if (err) {
				return res
									.status(500)
									.send({
										success: false,
										message: 'Error en la petición.',
										err: err
									});
			}

			if (!users) {
				return res
								.status(404)
								.send({
									success: false,
									message: 'No se encontraron usuarios disponibles.',
									err: err
								});
			}
      return res
              .status(200)
              .send({
                success: true,
                total,
                users,
                pages: Math.ceil(total/itemForPage)
              });
		})

}

function UpdateUser(req, res){

	let userId = req.params.id;
  let update = req.body;
	if ( userId !== req.user.sub ) {

		return res
						.status(500)
						.send({
							success: false,
							message: 'No tienes los permisos necesarios.'
						});

	}

	User.find({ $or: [{ email: update.email.toLowerCase() },
										{ nick: update.nick.toLowerCase() }]})
		.exec((err, users)=>{

			if (err) {
				return res
									.status(500)
									.send({
										success: false,
										message: 'Error al ubicar usuario.',
										err: err
									});
			}

			let exist_user = false;

			users.forEach(user=>{
				if (user && user._id != userId) exist_user = true;
			})

			if (exist_user) {
				return res
									.status(200)
									.send({
										success: false,
										message: 'El nombre de usuario o email ya existe!'
									});
			} else {

				User
					.findByIdAndUpdate( userId, update, { new:true } )
					.select('email name lastname image nick role _id ')
					.exec((err, user)=>{

						if (err) {
							return res
												.status(500)
												.send({
													success: false,
													message: 'Error en la petición.',
													err: err
												});
						}

						if (!user) {
							return res
											.status(404)
											.send({
												success: false,
												message: 'El usuario no se ha podido actualizar.',
												err: err
											});
						}

						return res
										.status(200)
										.send({
											success: true,
											message: 'El usuario se ha actualizado.',
											user
										});

					});
				
			}
		})


}

module.exports = {
	SaveUser,
	LoginUser,
	GetUser,
	GetUsers,
	UpdateUser
};