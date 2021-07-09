const { createHmac } = require('crypto');
const environment = require('./environments');
const utilities = {};

utilities.parseJSON = jsonString => {
	let result;
	try {
		result = JSON.parse(jsonString);
	} catch {
		result = '';
	}
	return result;
};
utilities.hash = str => {
	if (typeof str === 'string' && str.length > 0) {
		let hash = createHmac('sha256', environment.secretKey)
			.update(str)
			.digest('hex');
		return hash;
	}
};
module.exports = utilities;
