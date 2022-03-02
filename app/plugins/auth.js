const cookie = require('@hapi/cookie')
const authConfig = require('../config/auth')

module.exports = {
  plugin: {
    name: 'auth',
    register: async (server, options) => {
      await server.register(cookie)

      server.auth.strategy('session-auth', 'cookie', {
        cookie: authConfig.cookie,
        redirectTo: '/login',
        validateFunc: async (request, session) => {
          const sessionCache = await request.server.app.cache.get(session.sid)
          const valid = !!sessionCache
          const result = { valid }
          if (valid) {
            // TODO: replace with Defra Customer account
            result.credentials = sessionCache
          } else {
            console.log(`Session has no cache: ${session.sid}`)
          }
          return session.authenticated
            ? result
            : { valid: false }
        }
      })

      server.auth.default('session-auth')
    }
  }
}
