const Joi = require('joi')

const userSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    email: Joi.string().email().required(),
    firstname:  Joi.string().required(),
    lastname:  Joi.string().required(),
    location:  Joi.string().allow(''),
    university:  Joi.string().allow(''),
    tel:  Joi.string().allow(''),
    avatar: Joi.string().allow(''),
})

const appMakerSchema = Joi.object().keys({
    uni_name: Joi.string().required(),
    uni_abb: Joi.string().required(),
    uni_th_name: Joi.string().allow(''),
    uni_th_abb:  Joi.string().allow(''),
    color:  Joi.string().required(),
    createdBy:  Joi.string().required(),
    logo:  Joi.string().required(),
    features:  Joi.object().required()
})

const authenticateUserSchema = Joi.alternatives().try(
  Joi.object({
    username: Joi.string().alphanum().min(2).max(30).required(),
    password: Joi.string().required()
  }),
  Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
)

const getDataFromId = Joi.object().keys({
    _id: Joi.string().required()
})

module.exports = {
    userSchema,
    authenticateUserSchema,
    getDataFromId,
    appMakerSchema
}