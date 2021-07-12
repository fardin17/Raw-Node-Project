const data = require('./../lib/data');
const { parseJSON, randomToken } = require('./../helpers/utilities');
const { maxCheck } = require('./../helpers/environments');
const tokenHandler = require('./tokenHandler');
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
	const acceptMethod = ['get', 'post', 'put', 'delete'];
	if (acceptMethod.indexOf(requestProperties.method) > -1) {
		handler._check[requestProperties.method](requestProperties, callback);
	} else {
		callback(405);
	}
};
handler._check = {};
handler._check.post = (requestProperties, callback) => {
	let protocol =
		typeof requestProperties.body.protocol === 'string' &&
		['http', 'https'].indexOf(requestProperties.body.protocol) > -1
			? requestProperties.body.protocol
			: false;
	let url =
		typeof requestProperties.body.url === 'string' &&
		requestProperties.body.url.trim().length > 0
			? requestProperties.body.url
			: false;
	let method =
		typeof requestProperties.body.method === 'string' &&
		['POST', 'GET', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1
			? requestProperties.body.method
			: false;
	let successCode =
		typeof requestProperties.body.successCode === 'object' &&
		requestProperties.body.successCode instanceof Array
			? requestProperties.body.successCode
			: false;
	let timeOut =
		typeof requestProperties.body.timeOut === 'number' &&
		requestProperties.body.timeOut % 1 === 0 &&
		requestProperties.body.timeOut >= 1 &&
		requestProperties.body.timeOut <= 5
			? requestProperties.body.timeOut
			: false;
	if (protocol && url && method && successCode && timeOut) {
		const token =
			typeof requestProperties.headerObject.token === 'string' &&
			requestProperties.headerObject.token.trim().length === 10
				? requestProperties.headerObject.token
				: false;
		data.read('token', token, (err, tokenData) => {
			if (!err) {
				const phone = parseJSON(tokenData).phone;
				data.read('users', phone, (err, userData) => {
					if (!err) {
						tokenHandler._token.verify(phone, token, err => {
							if (!err) {
								const user = parseJSON(userData);
								const userChecks =
									typeof user.check === 'object' && user.check instanceof Array
										? user.check
										: [];
								if (userChecks.length < maxCheck) {
									const checkId = randomToken(10);
									const checkObject = {
										id: checkId,
										phone,
										protocol,
										url,
										method,
										successCode,
										timeOut,
									};
									data.create('check', checkId, checkObject, err => {
										if (!err) {
											user.check = userChecks;
											user.check.push(checkId);
											data.update('users', phone, user, err => {
												if (!err) {
													callback(200, checkObject);
												} else {
													callback(500, {
														Error: 'There was a wrong in server!',
													});
												}
											});
										} else {
											callback(500, {
												Error: 'There was a wrong in server!',
											});
										}
									});
								} else {
									callback(404, {
										Error: 'You crossed your limit already!',
									});
								}
							} else {
								callback(403, {
									Error: 'Authentication failure!',
								});
							}
						});
					} else {
						callback(404, {
							Error: 'User not Found',
						});
					}
				});
			} else {
				callback(403, {
					Error: 'Authentication failure!',
				});
			}
		});
	} else {
		callback(400, {
			Error: 'Your request is not valid!',
		});
	}
};
handler._check.get = (requestProperties, callback) => {};
handler._check.put = (requestProperties, callback) => {};
handler._check.delete = (requestProperties, callback) => {};

module.exports = handler;
