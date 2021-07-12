/*
 * Title: Uptime monitoring Application
 * Description: A RESTul API to monitor up or down time of user defined links
 * Author: Fardin Islam
 * Date: 07/09/21
 *
 */
const http = require('http');
const { handleReqRes } = require('./helpers/handleResReq');
const environment = require('./helpers/environments');
const { sendTwilioSms } = require('./helpers//notification');

const app = {};
sendTwilioSms('01720276336', 'Hello, Fardin', err => {
	console.log(err);
});
app.config = {};
app.createServer = () => {
	const server = http.createServer(handleReqRes);
	server.listen(environment.port, () => {
		console.log('Server listening at port at ', environment.port);
	});
};
app.createServer();
