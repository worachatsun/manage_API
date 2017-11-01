const config = require('./config')
const mongoose = require('mongoose')

module.exports = function() {
    mongoose.set('debug', config.debug)
    const db = mongoose.connect(config.mongoUri)

    require('../app/models/user.model')
    require('../app/models/make.app.model')
    
    return db
}