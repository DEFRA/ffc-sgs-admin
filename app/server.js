const Hapi = require('@hapi/hapi')
const nunjucks = require('nunjucks')
const path = require('path')
const { version } = require('../package.json')
const vision = require('@hapi/vision')
const inert = require('@hapi/inert')
const config = require('./config/server')
const crumb = require('@hapi/crumb')
const Uuid = require('uuid')
const protectiveMonitoringServiceSendEvent = require('./services/protective-monitoring-service')
const cacheConfig = require('./config/cache')
const catbox = cacheConfig.useRedis ? require('@hapi/catbox-redis') : require('@hapi/catbox-memory')
const authConfig = require('./config/auth')

async function createServer () {
  const server = Hapi.server({
    port: process.env.PORT,
    cache: [{
      name: 'session',
      provider: {
        constructor: catbox,
        options: cacheConfig.catboxOptions
      }
    }]
  })

  if (authConfig.enabled) {
    await server.register(require('./plugins/auth'))
  }

  await server.register(inert)
  await server.register(vision)
  await server.register(require('./plugins/cookies'))
  await server.register(require('./plugins/error-pages'))
  await server.register({
    plugin: require('./plugins/header'),
    options: {
      keys: [
        { key: 'X-Frame-Options', value: 'deny' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Access-Control-Allow-Origin', value: server.info.uri },
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Strict-Transport-Security', value: 'max-age=31537000;' },
        { key: 'Cache-Control', value: 'no-cache' }
      ]
    }
  })
  // GTM Server side
  await server.register({
    plugin: require('./plugins/gapi'),
    options: {
      propertySettings: [
        {
          id: config.googleTagManagerServerKey,
          hitTypes: ['pageview']
        }
      ],
      sessionIdProducer: async request => {
        return request.yar ? request.yar.id : Uuid.v4()
      },
      batchSize: 20,
      batchInterval: 15000
    }
  })
  const cache = server.cache({ cache: 'session', segment: 'sessions', expiresIn: cacheConfig.expiresIn })
  server.app.cache = cache
  // Session cache redis with yar
  await server.register([
    {
      plugin: require('@hapi/yar'),
      options: {
        maxCookieSize: cacheConfig.useRedis ? 0 : 1024,
        storeBlank: true,
        cache: {
          cache: 'session',
          expiresIn: cacheConfig.expiresIn
        },
        cookieOptions: {
          password: config.cookiePassword,
          isSecure: config.cookieOptions.isSecure,
          ttl: cacheConfig.expiresIn
        },
        customSessionIDGenerator: function (request) {
          const sessionID = Uuid.v4()
          protectiveMonitoringServiceSendEvent(request, sessionID, 'FTF-SESSION-CREATED', '0701')
          return sessionID
        }
      }
    },
    {
      plugin: crumb,
      options: {
        cookieOptions: {
          isSecure: config.cookieOptions.isSecure
        }
      }
    }]
  )

  const routes = [].concat(
    require('./routes/healthy'),
    require('./routes/healthz'),
    require('./routes/start'),
    require('./routes/login'),
    require('./routes/assets'),
    require('./routes/cookies'),
    require('./routes/accessibility'),
    require('./routes/session-timeout'),
    require('./routes/question'),
    require('./routes/applications'),
    require('./routes/business-details'),
    require('./routes/farmer-details'),
    require('./routes/confirmation'),
    require('./routes/agreement'),
    require('./routes/check-details'),
    require('./routes/cart'),
    require('./routes/livestock'),
    require('./routes/forestry'),
    require('./routes/stages'),
    require('./routes/dashboard'),
    require('./routes/applicationstages'),
    require('./routes/messages'),
    // ...require('./routes'),
    require('./routes/api/equipmentItems'),
    require('./routes/admin/dashboard'),
    require('./routes/business-process'),
    require('./routes/grants'),
    require('./routes/usergroups'),
    require('./routes/account/myaccount')
  )
  console.log('[SERVER][GET ALL ROUTES]')
  server.route(routes)
  // server.table().forEach(i => console.log(i.path))
  const nunjucksAppEnv = nunjucks.configure([
    path.join(__dirname, 'templates'),
    path.join(__dirname, 'assets', 'dist'),
    'node_modules/govuk-frontend/',
    'node_modules/@ministryofjustice/frontend/'
  ])

  // Add filters from MOJ Frontend
  let mojFilters = require('../node_modules/@ministryofjustice/frontend/moj/filters/all')()
  mojFilters = Object.assign(mojFilters)
  Object.keys(mojFilters).forEach(function (filterName) {
    nunjucksAppEnv.addFilter(filterName, mojFilters[filterName])
  })

  server.views({
    engines: {
      njk: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)
          return context => template.render(context)
        }
      }
    },
    relativeTo: __dirname,
    compileOptions: {
      environment: nunjucksAppEnv
    },
    path: './templates',
    context: {
      appVersion: version,
      assetpath: '/assets',
      govukAssetpath: '/assets',
      serviceName: 'FFC Grants Service',
      pageTitle: 'FFC Grants Service'
    }
  })

  return server
}
module.exports = createServer
