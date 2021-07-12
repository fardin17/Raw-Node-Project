const { aboutHandler } = require('./handlers/aboutHandlers');
const { tokenHandler } = require('./handlers/tokenHandler');
const { userHandler } = require('./handlers/userHandler');
const { checkHandler } = require('./handlers/checkHandler');

const routes = {
	about: aboutHandler,
	user: userHandler,
	token: tokenHandler,
	check: checkHandler,
};

module.exports = routes;
