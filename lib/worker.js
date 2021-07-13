const url = require('url');
const http = require('http');
const https = require('https');
const { parseJSON } = require('../helpers/utilities');
const data = require('./data');
const { sendTwilioSms } = require('../helpers/notification');

const worker = {};
worker.config = {};

worker.alertSms = tempCheckData => {
	const msg = `Alert! Your check for ${tempCheckData.method.toUpperCase()} ${
		tempCheckData.protocol
	}://${tempCheckData.url} is currently ${tempCheckData.status} `;
	sendTwilioSms(tempCheckData.phone, msg, err => {
		if (!err) {
			console.log(`Sending msg: ${msg}`);
		} else {
			console.log('There was a problem to send SMS!');
		}
	});
};

worker.processCheckOutcome = (originalCheckData, checkOutcome) => {
	const state =
		!checkOutcome &&
		checkOutcome.responseCode &&
		originalCheckData.successCode.indexOf(checkOutcome.responseCode) > -1
			? 'up'
			: 'down';
	const alert =
		originalCheckData.lastChecked && originalCheckData.status !== state
			? true
			: false;
	let tempCheckData = originalCheckData;
	tempCheckData.status = state;
	tempCheckData.lastChecked = Date.now();
	data.update('check', originalCheckData.id, tempCheckData, err => {
		if (!err) {
			if (alert) {
				worker.alertSms(tempCheckData);
			} else {
				console.log('Alert is not needed!');
			}
		} else {
			console.log('Error: Failed to update one of the checks!');
		}
	});
};

worker.performCheck = originalCheckData => {
	let checkOutcome = {
		error: false,
		responseCode: false,
	};
	let outcomeSent = false;
	const parsedUrl = url.parse(
		originalCheckData.protocol + '://' + originalCheckData.url,
		true,
	);
	const hostname = parsedUrl.hostname;
	const path = parsedUrl.path;
	const requestDetails = {
		protocol: `${originalCheckData.protocol}:`,
		hostname,
		path,
		method: originalCheckData.method.toUpperCase(),
		timeout: originalCheckData.timeOut * 1000,
	};
	console.log(requestDetails.protocol);
	let protocolToUse = http;
	protocolToUse = originalCheckData.protocol == 'https' ? https : protocolToUse;

	let req = protocolToUse.request(requestDetails, res => {
		let status = res.statusCode;
		checkOutcome.responseCode = status;
		if (!outcomeSent) {
			worker.processCheckOutcome(originalCheckData, checkOutcome);
			outcomeSent = true;
		}
	});
	req.on('error', e => {
		checkOutcome = {
			error: true,
			value: null,
		};
		if (!outcomeSent) {
			worker.processCheckOutcome(originalCheckData, checkOutcome);
			outcomeSent = true;
		}
	});
	req.on('timeout', () => {
		checkOutcome = {
			error: true,
			value: 'timeout',
		};
		if (!outcomeSent) {
			worker.processCheckOutcome(originalCheckData, checkOutcome);
			outcomeSent = true;
		}
	});
	req.end();
};

worker.validateCheckData = checkData => {
	let originalCheckData = checkData;
	if (checkData) {
		originalCheckData.status =
			typeof checkData.status === 'string' &&
			['up', 'down'].indexOf(checkData.status) > -1
				? checkData.status
				: 'down';
		originalCheckData.lastChecked =
			typeof checkData.lastChecked === 'number' && checkData.lastChecked > 0
				? checkData.lastChecked
				: false;
		worker.performCheck(originalCheckData);
	} else {
		console.log('Error: check is inavalid!');
	}
};

worker.gatherAllChecks = () => {
	data.list('check', (err, checks) => {
		if (!err && checks && checks.length > 0) {
			checks.forEach(check => {
				data.read('check', check, (err, checkData) => {
					if (!err && checkData) {
						worker.validateCheckData(parseJSON(checkData));
					} else {
						console.log('Error: Could find one of the checkdata!');
					}
				});
			});
		} else {
			console.log('Error: Could not find any checks to process!');
		}
	});
};
worker.loop = () => {
	setInterval(() => {
		worker.gatherAllChecks();
	}, 1000 * 60);
};
worker.int = () => {
	worker.gatherAllChecks();
	worker.loop();
};

module.exports = worker;
