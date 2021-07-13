/*
 * Title: Uptime monitoring Application
 * Description: A RESTul API to monitor up or down time of user defined links
 * Author: Fardin Islam
 * Date: 07/09/21
 *
 */
const worker = require('./lib/worker');
const server = require('./lib/server');

const app = {};
app.init = () => {
	worker.int();
	server.init();
};
app.init();
