const data = require('./../lib/data');
const { parseJSON } = require('./../helpers/utilities');
const { hash } = require('./../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const handler = {};

handler.userHandler = (requestProperties, callback) => {
	const acceptMethod = ['get', 'post', 'put', 'delete'];
	if (acceptMethod.indexOf(requestProperties.method) > -1) {
		handler._users[requestProperties.method](requestProperties, callback);
	} else {
		callback(405);
	}
};
handler._users = {};
handler._users.post = (requestProperties, callback) => {
	const firstName =
		typeof requestProperties.body.firstName === 'string' &&
		requestProperties.body.firstName.trim().length > 0
			? requestProperties.body.firstName
			: false;
	const lastName =
		typeof requestProperties.body.lastName === 'string' &&
		requestProperties.body.lastName.trim().length > 0
			? requestProperties.body.lastName
			: false;
	const phone =
		typeof requestProperties.body.phone === 'string' &&
		requestProperties.body.phone.trim().length === 11
			? requestProperties.body.phone
			: false;
	const password =
		typeof requestProperties.body.password === 'string' &&
		requestProperties.body.password.trim().length > 0
			? requestProperties.body.password
			: false;
	const tosAggrement =
		typeof requestProperties.body.tosAggrement === 'boolean'
			? requestProperties.body.tosAggrement
			: false;
	if (firstName && lastName && phone && password && tosAggrement) {
		data.read('users', phone, err1 => {
			if (err1) {
				const userProperties = {
					firstName,
					lastName,
					phone,
					password: hash(password),
					tosAggrement,
				};
				data.create('users', phone, userProperties, err2 => {
					if (!err2) {
						callback(200, {
							message: 'Data inserted Successfully',
						});
					} else {
						callback(500, {
							Error: 'User can not insert!',
						});
					}
				});
			} else {
				callback(400, {
					message: 'User already exits',
				});
			}
		});
	}
};
handler._users.get = (requestProperties, callback) => {
	const phone =
		typeof requestProperties.queryStringObject.phone === 'string' &&
		requestProperties.queryStringObject.phone.trim().length === 11
			? requestProperties.queryStringObject.phone
			: false;
	const token =
		typeof requestProperties.headerObject.token === 'string' &&
		requestProperties.headerObject.token.trim().length === 10
			? requestProperties.headerObject.token
			: false;
	if (phone && token) {
		tokenHandler._token.verify(phone, token, err => {
			if (!err) {
				data.read('users', phone, (err, u) => {
					const user = { ...parseJSON(u) };
					if (!err && user) {
						delete user.password;
						callback(200, user);
					} else {
						callback(404, {
							Error: 'User not Found',
						});
					}
				});
			} else {
				callback(403, {
					Error: 'Token not found!',
				});
			}
		});
	} else {
		callback(404, {
			Error: 'User not Found',
		});
	}
};
handler._users.put = (requestProperties, callback) => {
	const firstName =
		typeof requestProperties.body.firstName === 'string' &&
		requestProperties.body.firstName.trim().length > 0
			? requestProperties.body.firstName
			: false;
	const lastName =
		typeof requestProperties.body.lastName === 'string' &&
		requestProperties.body.lastName.trim().length > 0
			? requestProperties.body.lastName
			: false;
	const phone =
		typeof requestProperties.body.phone === 'string' &&
		requestProperties.body.phone.trim().length === 11
			? requestProperties.body.phone
			: false;
	const password =
		typeof requestProperties.body.password === 'string' &&
		requestProperties.body.password.trim().length > 0
			? requestProperties.body.password
			: false;
	const token =
		typeof requestProperties.headerObject.token === 'string' &&
		requestProperties.headerObject.token.trim().length === 10
			? requestProperties.headerObject.token
			: false;
	if (phone) {
		if (firstName || lastName || password) {
			tokenHandler._token.verify(phone, token, err => {
				if (!err) {
					data.read('users', phone, (err, uData) => {
						const userData = { ...parseJSON(uData) };
						if (!err && userData) {
							if (firstName) {
								userData.firstName = firstName;
							}
							if (lastName) {
								userData.lastName = lastName;
							}
							if (password) {
								userData.password = hash(password);
							}
							data.update('users', phone, userData, err => {
								if (!err) {
									callback(200, {
										message: 'User updated Succesfully',
									});
								} else {
									callback(500, {
										message: 'There was an error in the server side!',
									});
								}
							});
						} else {
							callback(400, {
								message: 'User is not not found!',
							});
						}
					});
				} else {
					callback(400, {
						message: 'Token is not valid or expired!',
					});
				}
			});
		} else {
			callback(400, {
				message: 'Your provided data is not valid!',
			});
		}
	} else {
		callback(400, {
			message: 'Your Phone number is not valid!',
		});
	}
};
handler._users.delete = (requestProperties, callback) => {
	const phone =
		typeof requestProperties.queryStringObject.phone === 'string' &&
		requestProperties.queryStringObject.phone.trim().length === 11
			? requestProperties.queryStringObject.phone
			: false;
	const token =
		typeof requestProperties.headerObject.token === 'string' &&
		requestProperties.headerObject.token.trim().length === 10
			? requestProperties.headerObject.token
			: false;
	console.log(phone, token);
	if (phone && token) {
		tokenHandler._token.verify(phone, token, err => {
			if (!err) {
				data.read('users', phone, (err, userdata) => {
					if (!err) {
						data.delete('users', phone, err => {
							if (!err) {
								callback(200, {
									result: 'Succesfully deleted',
								});
							} else {
								callback(500, {
									message: 'There was a server side error',
								});
							}
						});
					} else {
						callback(400, {
							message: 'Request is not valid!',
						});
					}
				});
			} else {
				callback(403, {
					Error: 'Token not found!',
				});
			}
		});
	} else {
		callback(400, {
			message: 'Your request is not valid!',
		});
	}
};

module.exports = handler;
