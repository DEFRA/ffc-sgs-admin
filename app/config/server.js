const Joi = require('joi')
const urlPrefix = '/equipmentGrant'
const startPageUrl = '/cart'

// Define config schema
const schema = Joi.object({
  urlPrefix: Joi.string().default(urlPrefix),
  cookiePassword: Joi.string().default('dummycookiepassworddummycookiepassword'),
  googleTagManagerKey: Joi.string().default('GTM-WJ5C78H'),
  googleTagManagerServerKey: Joi.string().default('UA-179628664-4'),
  protectiveMonitoringUrl: Joi.string().allow(''),
  startPageUrl: Joi.string().default(`${startPageUrl}`),
  cookieOptions: Joi.object({
    ttl: Joi.number().default(1000 * 60 * 60 * 24 * 365),
    encoding: Joi.string().valid('base64json').default('base64json'),
    isSecure: Joi.bool().default(true),
    isHttpOnly: Joi.bool().default(true),
    clearInvalid: Joi.bool().default(false),
    strictHeader: Joi.bool().default(true)
  }),
  appInsights: {
    key: Joi.string(),
    role: Joi.string().default('ffc-sgs-admin')
  }
})

// Build config
const config = {
  urlPrefix: process.env.URL_PREFIX,
  cookiePassword: process.env.COOKIE_PASSWORD,
  googleTagManagerKey: process.env.GOOGLE_TAG_MANAGER_KEY,
  googleTagManagerServerKey: process.env.GOOGLE_TAG_MANAGER_SERVER_KEY,
  protectiveMonitoringUrl: process.env.PROTECTIVE_MONITORING_URL,
  startPageUrl: process.env.START_PAGE_URL,
  cookieOptions: {
    ttl: process.env.COOKIE_TTL_IN_MILLIS,
    encoding: 'base64json',
    isSecure: process.env.NODE_ENV === 'production',
    isHttpOnly: true,
    clearInvalid: false,
    strictHeader: true
  },
  appInsights: {
    key: process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
    role: process.env.APPINSIGHTS_CLOUDROLE
  }
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}
module.exports = result.value
