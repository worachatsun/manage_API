process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const mongoose = require('./config/mongoose')
const Hapi = require('./config/hapi')
const db = mongoose()
const server = Hapi()

server.start((err) => {
    if(err) { throw err }
    console.log('Server running at: ', server.info.uri)
})

module.exports = server