/*
 * Title: Uptime monitoring Application
 * Description: A RESTul API to monitor up or down time of user defined links
 * Author: Fardin Islam
 * Date: 07/13/21
 *
 */
const http = require('http');
const { handleReqRes } = require('../helpers/handleResReq');
const environment = require('../helpers/environments');

const server = {};
server.config = {};
server.createServer = () => {
	const serverVariable = http.createServer(server.handleReqRes);
	serverVariable.listen(environment.port, () => {
		console.log('Server listening at port at ', environment.port);
	});
	server.handleReqRes = handleReqRes;
};
server.init = () => {
	server.createServer();
};
module.exports = server;
