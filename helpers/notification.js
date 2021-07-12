const https = require('https');
const { twilio } = require('./environments');
const queryString = require('querystring');

const notifications = {};

notifications.sendTwilioSms = (phone, sms, callback) => {
	const userPhone =
		typeof phone === 'string' && phone.trim().length === 11
			? phone.trim()
			: false;
	const userSms =
		typeof sms === 'string' &&
		sms.trim().length > 0 &&
		sms.trim().length <= 1600
			? sms.trim()
			: false;
	if (userPhone && userSms) {
		const paylod = {
			From: twilio.fromPhone,
			To: `+88${userPhone}`,
			Body: userSms,
		};
		const stringifyPaylod = queryString.stringify(paylod);
		const requestDetails = {
			hostname: 'api.twilio.com',
			method: 'POST',
			path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
			auth: `${twilio.accountSid}:${twilio.authToken}`,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		};
		const req = https.request(requestDetails, res => {
			console.log('statusCode:', res.statusCode);
			console.log('headers:', res.headers);
			const status = res.statusCode;
			if (status === 200 || status === 201) {
				callback(false);
			} else {
				callback(`Status code ${status}`);
			}
		});
		req.write(stringifyPaylod);
		req.on('error', e => {
			console.error(e);
		});
		req.end();
	} else {
		callback('Given parameters invalid or missing');
	}
};
module.exports = notifications;
