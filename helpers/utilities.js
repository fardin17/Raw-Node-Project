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
utilities.randomToken = tokenLength => {
	const length =
		typeof tokenLength === 'number' && tokenLength > 0 ? tokenLength : false;
	if (length) {
		const possibleCharacter = 'qwertyuiopasdfghjklzxcvbnm1234567890';
		let output = '';
		for (let i = 0; i < length; i++) {
			let randomChar = possibleCharacter.charAt(
				Math.floor(Math.random() * possibleCharacter.length),
			);
			output += randomChar;
		}
		return output;
	} else {
		return false;
	}
};
module.exports = utilities;
