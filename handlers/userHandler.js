const data = require('./../lib/data');
const { hash } = require('./../helpers/utilities');
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
	callback(200);
};
handler._users.put = (requestProperties, callback) => {};
handler._users.delete = (requestProperties, callback) => {};

module.exports = handler;
