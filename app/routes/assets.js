const expiresIn = require('../config/cache').expiresIn

module.exports = {
  method: 'GET',
  path: '/assets/{path*}',
  options: {
    handler: {
      directory: {
        path: ['app/assets/dist', 'node_modules/govuk-frontend/govuk/assets']
      }
    },
    cache: {
      expiresIn: expiresIn,
      privacy: 'private'
    },
    auth: false
  }
}
