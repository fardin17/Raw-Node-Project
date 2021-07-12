const environments = {};

environments.staging = {
	port: 3000,
	env: 'staging',
	secretKey: 'fardinfardin',
	maxCheck: 5,
};
environments.production = {
	port: 5000,
	env: 'production',
	secretKey: 'IslamIslam',
	maxCheck: 5,
};

const currentEnvironment =
	typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

const environmentToExport =
	typeof environments[currentEnvironment] === 'object'
		? environments[currentEnvironment]
		: environments.staging;

module.exports = environmentToExport;
