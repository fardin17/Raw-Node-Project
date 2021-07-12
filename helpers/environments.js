const environments = {};

environments.staging = {
	port: 3000,
	env: 'staging',
	secretKey: 'fardinfardin',
	maxCheck: 5,
	twilio: {
		fromPhone: '+18327803658',
		accountSid: 'ACa30a6e223d63dbb3609bdc7d5c2e4255',
		authToken: '8694089e56f93e3054c3fbd837d2381e',
	},
};
environments.production = {
	port: 5000,
	env: 'production',
	secretKey: 'IslamIslam',
	maxCheck: 5,
	twilio: {
		fromPhone: '+18327803658',
		accountSid: 'ACa30a6e223d63dbb3609bdc7d5c2e4255',
		authToken: '8694089e56f93e3054c3fbd837d2381e',
	},
};

const currentEnvironment =
	typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

const environmentToExport =
	typeof environments[currentEnvironment] === 'object'
		? environments[currentEnvironment]
		: environments.staging;

module.exports = environmentToExport;
