const index = require('../controllers/index.controller')
const appMaker = require('../controllers/make.app.controller')
const auth = require('../controllers/auth.controller')
const user = require('../controllers/user.controller')
const validateSchema = require('../schemas/validate.schema')

module.exports = (server) => {

    server.route([
        {
            method: 'GET',
            path: '/{name}',
            config: {
                auth: false
            },
            handler: index.render
        },
        {
            method: 'POST',
            path: '/auth/register',
            config: { 
                auth: false,
                validate: {
                    payload: validateSchema.userSchema
                },
                handler: auth.register
            }
        },
        {
            method: 'POST',
            path: '/auth/login',
            config: {
                auth: false,
                pre: [
                    { method: auth.verifyCredentials, assign: 'user' }
                ],
                handler: auth.login,
                validate: {
                    payload: validateSchema.authenticateUserSchema
                }
            }
        },
        {
            method: 'POST',
            path: '/api/userData',
            config: {
                handler: user.getUserData,
            }
        },
        {
            method: 'POST',
            path: '/auth/changePassword',
            config: {
                handler: auth.changePassword,
            }
        },
        {
            method: 'POST',
            path: '/api/displayUpload',
            config: {
                auth: false,
                handler: user.displayUploadData,
                cors: {
                    origin: ['*'],
                    additionalHeaders: ['cache-control', 'x-requested-with']
                }
            }
        }
    ])

    server.route([
        {
            method: 'POST',
            path: '/api/saveAppInfo',
            config: {
                handler: appMaker.saveAppInfo,
                validate: {
                    payload: validateSchema.appMakerSchema
                }
            }
        },
        {
            method: 'POST',
            path: '/api/getAppByUser',
            config: {
                handler: appMaker.searchAppByUserId
            }
        },
        {
            method: 'PUT',
            path: '/auth/updateUserData',
            config: {
                handler: user.updateUserData
            }
        },
        {
            method: 'GET',
            path: '/api/downloadAndroid/{id}',
            config: {
                auth: false,
                handler: appMaker.downloadAndroid
            }
        },
        {
            method: 'GET',
            path: '/api/downloadIOS/{id}',
            config: {
                auth: false,
                handler: appMaker.downloadIOS
            }
        },
        {
            method: 'POST',
            path: '/api/updateAppData',
            config: {
                handler: appMaker.updateAppData
            }
        },
        {
            method: 'POST',
            path: '/api/deleteApp',
            config: {
                handler: appMaker.deleteApp
            }
        },
        {
            method: 'GET',
            path: '/api/searchAppById/{id}',
            config: {
                auth: false,
                handler: appMaker.searchAppById
            }
        },
        {
            method: 'GET',
            path: '/api/testPython',
            config: {
                auth: false,
                handler: appMaker.testPython
            }
        }
    ])
}