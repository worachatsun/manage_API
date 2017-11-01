const Hapi = require('hapi')
const server = new Hapi.Server()
const env = require('dotenv').config()
const Inert = require('inert')

module.exports = () => {
    
    server.connection({
        host: process.env.HOST || '0.0.0.0',
        port: process.env.PORT || 3000,
        routes: { cors: true }
    })

    server.register(Inert, () => {})
    
    require('./jwt')(server)
    require('../app/routes/index.route')(server)

    return server
}
