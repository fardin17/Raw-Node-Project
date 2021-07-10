const { aboutHandler } = require('./handlers/aboutHandlers');
const { tokenHandler } = require('./handlers/tokenHandler');
const { userHandler } = require('./handlers/userHandler');

const routes = {
	about: aboutHandler,
	user: userHandler,
	token: tokenHandler,
};

module.exports = routes;
