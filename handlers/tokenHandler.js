const data = require('./../lib/data');
const { parseJSON } = require('./../helpers/utilities');
const { hash } = require('./../helpers/utilities');
const { randomToken } = require('./../helpers/utilities');
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
	const acceptMethod = ['get', 'post', 'put', 'delete'];
	if (acceptMethod.indexOf(requestProperties.method) > -1) {
		handler._token[requestProperties.method](requestProperties, callback);
	} else {
		callback(405);
	}
};
handler._token = {};
handler._token.post = (requestProperties, callback) => {
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
	if (phone && password) {
		data.read('users', phone, (err, user) => {
			let hashedPass = hash(password);
			if (!err && hashedPass === parseJSON(user).password) {
				const tokenId = randomToken(10);
				const expire = Date.now() + 60 * 60 * 1000;
				const tokenObject = {
					phone,
					id: tokenId,
					expire,
				};
				data.create('token', tokenId, tokenObject, err => {
					if (!err) {
						callback(200, {
							message: 'token created successfully!',
						});
					} else {
						callback(500, {
							message: 'There was a server side error!',
						});
					}
				});
			} else {
				callback(400, {
					message: 'Your request is not valid!',
				});
			}
		});
	} else {
		callback(400, {
			message: 'Your request is not valid!',
		});
	}
};
handler._token.get = (requestProperties, callback) => {
	const id =
		typeof requestProperties.queryStringObject.id === 'string' &&
		requestProperties.queryStringObject.id.trim().length > 0
			? requestProperties.queryStringObject.id
			: false;
	if (id) {
		data.read('token', id, (err, token) => {
			const tokenData = { ...parseJSON(token) };
			if (!err && tokenData) {
				callback(200, tokenData);
			} else {
				callback(404, {
					Error: 'Token not Found',
				});
			}
		});
	} else {
		callback(400, {
			Error: ' Your request is not Found',
		});
	}
};
handler._token.put = (requestProperties, callback) => {
	const id =
		typeof requestProperties.body.id === 'string' &&
		requestProperties.body.id.trim().length === 10
			? requestProperties.body.id
			: false;
	const extend =
		typeof requestProperties.body.extend === 'boolean'
			? requestProperties.body.extend
			: false;
	if (id && extend) {
		data.read('token', id, (err, token) => {
			const tokenData = parseJSON(token);
			if (!err && tokenData.expire > Date.now()) {
				tokenData.expire = Date.now() + 60 * 60 * 1000;
				data.update('token', id, tokenData, err => {
					if (!err) {
						callback(200, {
							message: 'Token expire extend',
						});
					} else {
						callback(500, {
							Error: 'Server side error!',
						});
					}
				});
			} else {
				callback(400, {
					Error: 'Token is expired!',
				});
			}
		});
	} else {
		callback(400, {
			Error: 'User request is not valid!',
		});
	}
};
handler._token.delete = (requestProperties, callback) => {
	const id =
		typeof requestProperties.queryStringObject.id === 'string' &&
		requestProperties.queryStringObject.id.trim().length === 10
			? requestProperties.queryStringObject.id
			: false;
	if (id) {
		data.read('token', id, (err, token) => {
			if (!err) {
				data.delete('token', id, err => {
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
					message: 'Your request is not valid!',
				});
			}
		});
	} else {
		callback(400, {
			message: 'Your request is not valid!',
		});
	}
};
handler._token.verify = (phoneNo, tokenID, callback) => {
	const id =
		typeof tokenID === 'string' && tokenID.trim().length === 10
			? tokenID
			: false;
	const phone =
		typeof phoneNo === 'string' && phoneNo.trim().length === 11
			? phoneNo
			: false;
	if (phone && id) {
		data.read('token', id, (err, token) => {
			let tokenData = parseJSON(token);
			if (!err) {
				if (phone === tokenData.phone && tokenData.expire > Date.now()) {
					callback(false);
				} else {
					callback(true);
				}
			} else {
				callback(true);
			}
		});
	}
};
module.exports = handler;
