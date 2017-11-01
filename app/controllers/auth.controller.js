const mongoose = require('mongoose')
const User = mongoose.model('User')
const Boom = require('boom')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const validateSchema = require('../schemas/validate.schema')
const JWT = require('jsonwebtoken')
const env = require('dotenv').config()

createJWTToken = user => {
    const { _id, username, admin } = user
    let scopes

    if (admin) {
        scopes = 'admin'
    }

    return JWT.sign({ _id, username, scope: scopes}, process.env.SECRET_KEY, { algorithm: 'HS256' } )
}

exports.login = (req, rep) => {
    const dataCreateToken = Object.assign({}, req.pre.user)
    delete dataCreateToken._doc.password
    return rep({ token: createJWTToken(dataCreateToken._doc), user: dataCreateToken._doc }).code(201)
}

exports.register = (req, rep) => {
    const { username, password, email, firstname, lastname, location, university, tel, avatar } = req.payload 
    
    const user = new User({
        username, 
        password, 
        email, 
        firstname, 
        lastname, 
        location, 
        university, 
        tel,
        avatar
    })

    const result = Joi.validate({username, password, email, firstname, lastname, location, university, tel }, validateSchema.userSchema, (err, value) => {
        if(err) {return rep(Boom.badRequest(err))}
        bcrypt.hash(password, 10).then((hash) => {
            user.password = hash
            user.save((err, user) => {
                if(err) { return rep(Boom.badRequest(err)) }
                const dataCreateToken = Object.assign({}, user)
                delete dataCreateToken._doc.password
                return rep({ token: createJWTToken(dataCreateToken._doc), user: dataCreateToken._doc }).code(201)
            })
        })
    })
}

exports.verifyUniqueUser = (req, rep) => {
    const { username, password, email } = req.payload 

    User.findOne({
        $or: [
            { email },
            { username }
        ]
    }, (err, user) => {
        if (user) {
            if (user.username === username) {
                return rep(Boom.badRequest('Username taken'))
            }
            if (user.email === email) {
                return rep(Boom.badRequest('Email taken'))
            }
        }

        return rep(req.payload)
    })
}

exports.verifyCredentials = (req, rep) => {
    const { username, email, password } = req.payload

    User.findOne({
        $or: [
            { email },
            { username }
        ]
    }, (err, user) => {
        if(err) { return rep(Boom.badRequest(err)) }
        if(user) {
            bcrypt.compare(password, user.password, (err, isValid) => {
                if(isValid) 
                    return rep(user)
                else
                    return rep(Boom.badRequest('Incorrect password'))
            })
        }else
            return rep(Boom.badRequest('Incorrect username or email'))
    })
}

exports.forgetPassword = (req, rep) => {

}

exports.changePassword = (req, rep) => {
    const { _id, oldPassword, newPassword } = req.payload

    User.findById(_id, (err, user) => {
        if(err) { return rep(Boom.badRequest(err)) }
        if(user) {
            bcrypt.compare(oldPassword, user.password, (err, isValid) => {
                if(isValid) {
                    bcrypt.hash(newPassword, 10).then(hash => {
                        User.findByIdAndUpdate(_id, {password: hash}, {new: true}, (err, user) => {
                            return rep({user})
                        })
                    })
                } else {
                    return rep(Boom.badRequest('Incorrect password'))
                }
            })
        }
    })
}