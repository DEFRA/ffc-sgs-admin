const Joi = require('joi')
const authConfig = require('../config/auth')
const bcrypt = require('bcrypt')

const { v4: uuidv4 } = require('uuid')
const viewTemplate = 'login'
const currentPath = `/${viewTemplate}`
const nextPath = '/'

const errorText = 'Enter the username and password you\'ve been given'

function createModel (errorMessage) {
  return {
    formActionPage: currentPath,
    usernameInput: {
      label: {
        text: 'Username'
      },
      classes: 'govuk-input--width-10',
      id: 'username',
      name: 'username'
    },
    passwordInput: {
      label: {
        text: 'Password'
      },
      classes: 'govuk-input--width-10',
      id: 'password',
      name: 'password',
      type: 'password'
    },
    errorMessage
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    options: {
      auth: false
    },
    handler: (request, h) => {
      request.yar.reset()
      return h.view(viewTemplate, createModel(null))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      auth: false,
      validate: {
        payload: Joi.object({
          username: Joi.string().valid(authConfig.credentials.username),
          password: Joi.string().custom((value, helpers) => {
            if (bcrypt.compareSync(value, authConfig.credentials.passwordHash)) {
              return value
            }

            throw new Error('Incorrect password')
          })
        }),
        failAction: (request, h, err) => {
          console.log('Authentication failed')
          return h.view(viewTemplate, createModel(errorText)).takeover()
        }
      },
      handler: async (request, h) => {
        const userName = request.payload.username
        const sid = uuidv4()
        const userDetails = {
          authenticated: true,
          userName: userName,
          firstName: 'Satish', // userName.substring(0, userName.indexOf('.')),
          lastName: 'Chatap', // userName.substring(userName.indexOf('.') + 1, userName.lastIndexOf('@')),
          crn: 1104955083,
          callerId: 4999997,
          sid
        }
        request.cookieAuth.set(userDetails)
        await request.server.app.cache.set(sid, userDetails)
        return h.redirect(nextPath)
      }
    }
  },
  {
    method: 'GET',
    path: '/logout',
    handler: (request, h) => {
      request.cookieAuth.clear()
      return h.redirect(currentPath)
    }
  }
]
