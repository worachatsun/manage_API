const mongoose = require('mongoose')
const Schema = mongoose.Schema

let UserSchema = new Schema({
    email: { type: String, required: true, index: { unique: true } },
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    firstname: {type: String},
    lastname: {type: String},
    location: {type: String},
    university: {type: String},
    tel: {type: String},
    avatar: {type: String}
})

mongoose.model('User', UserSchema)