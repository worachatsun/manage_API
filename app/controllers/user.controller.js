const Boom = require('boom')
const User = require('mongoose').model('User')
const jwt = require('jsonwebtoken')
const env = require('dotenv').config()

exports.getUserData = (req, rep) => {
    if(req.headers.authorization){
        const authorization = req.headers.authorization
        try {
            decoded = jwt.verify(authorization, process.env.SECRET_KEY)
        } catch (e) {
            return rep(Boom.proxyAuthRequired('Unauthorized'))
        }

        User.findOne({ _id: decoded._id }, (err, user) => {
            if(err) { return rep(Boom.notFound(err)) }
            const dataCreateToken = Object.assign({}, user)
            delete dataCreateToken._doc.password
            return rep({user: dataCreateToken._doc})
        })
    }else{
        return rep(Boom.badRequest('Server Error or Unauthorized'))
    }
}

exports.updateUserData = (req, rep) => {
    const { _id, name, bio, url, company } = req.payload

    const updateData = {
        name,
        bio,
        url,
        company
    }

    User.findByIdAndUpdate(_id, updateData, {new: true}, (err, user) => {
        if(err) { return rep(Boom.notFound(err)) }
        return rep({user})
    })
}

exports.displayUploadData = (req, rep) => {
    return rep(req.payload)
}

exports.updateUserData = (req, rep) => {
    const { _id, tel, avatar, email, firstname, lastname, location, university } = req.payload

    const updateData = {
        _id, 
        tel, 
        avatar, 
        email, 
        firstname, 
        lastname, 
        location, 
        university
    }
    
    User.findByIdAndUpdate(_id, updateData, {new: true}, (err, user) => {
        if(err) { return rep(Boom.notFound(err)) }
        return rep({user})
    })
}