const { aboutHandler } = require('./handlers/aboutHandlers')
const {userHandler}=require('./handlers/userHandler')

const routes = {
     about: aboutHandler,
     user:userHandler
}

module.exports = routes