const mongoose = require('mongoose')
const Schema = mongoose.Schema

let AppMakerSchema = new Schema({
    uni_name: {type: String, required: true},
    uni_abb: {type: String, required: true},
    uni_th_name: String,
    uni_th_abb: String,
    color: {type: String, default: '#FF5A5F'},
    logo: {type: String, required: true},
    features: {
        career: {type: Boolean, required: true},
        donate: {type: Boolean, required: true},
        event: {type: Boolean, required: true},
        news: {type: Boolean, required: true}
    },
    android_download: String,
    web_api: String,
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

mongoose.model('AppMaker', AppMakerSchema)