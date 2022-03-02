const Joi = require('joi')

const sharedConfigSchema = {
  appInsights: Joi.object(),
  host: Joi.string().default('localhost'),
  password: Joi.string(),
  username: Joi.string(),
  useCredentialChain: Joi.bool().default(false)
}

const messageConfigSchema = Joi.object({
  projectDetailsQueue: {
    address: Joi.string().default('projectDetails'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  contactDetailsQueue: {
    address: Joi.string().default('contactDetails'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  applicationSubscription: {
    address: Joi.string().default('contactDetails'),
    type: Joi.string(),
    topic: Joi.string(),
    ...sharedConfigSchema
  },
  applicationTaskSubscription: {
    address: Joi.string().default('contactDetails'),
    type: Joi.string(),
    topic: Joi.string(),
    ...sharedConfigSchema
  },
  notificationDetailsQueue: {
    address: Joi.string().default('notificationDetails'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  eligibilityAnswersMsgType: Joi.string(),
  projectDetailsMsgType: Joi.string(),
  contactDetailsMsgType: Joi.string(),
  applicationMsgType: Joi.string(),
  applicationTaskMsgType: Joi.string(),
  notificationDetailsMsgType: Joi.string(),
  msgSrc: Joi.string()
})

const sharedConfig = {
  appInsights: require('applicationinsights'),
  host: process.env.SERVICE_BUS_HOST,
  password: process.env.SERVICE_BUS_PASSWORD,
  username: process.env.SERVICE_BUS_USER,
  useCredentialChain: process.env.NODE_ENV === 'production'
}

const sharedCrmConfig = {
  appInsights: require('applicationinsights'),
  host: process.env.SGS_SERVICE_BUS_HOST,
  password: process.env.SGS_SERVICE_BUS_PASSWORD,
  username: process.env.SGS_SERVICE_BUS_USER,
  useCredentialChain: process.env.NODE_ENV === 'production'
}

const msgTypePrefix = 'uk.gov.ffc.grants'

const config = {
  projectDetailsQueue: {
    address: process.env.PROJECT_DETAILS_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  contactDetailsQueue: {
    address: process.env.CONTACT_DETAILS_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  applicationSubscription: {
    address: process.env.APPLICATION_RECEIVED_SUBSCRIPTION_ADDRESS,
    topic: process.env.APPLICATION_DETAIL_TOPIC_ADDRESS,
    type: 'subscription',
    ...sharedConfig
  },
  applicationTaskSubscription: {
    address: 'task-admin-subscription',
    topic: 'sgs-application-task-topic',
    type: 'subscription',
    ...sharedCrmConfig
  },
  notificationDetailsQueue: {
    address: process.env.SGS_NOTIFICATION_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedCrmConfig
  },
  eligibilityAnswersMsgType: `${msgTypePrefix}.av.eligibility.details`,
  projectDetailsMsgType: `${msgTypePrefix}.av.project.details`,
  contactDetailsMsgType: `${msgTypePrefix}.av.contact.details`,
  applicationMsgType: `${msgTypePrefix}.application.details`,
  applicationTaskMsgType: `${msgTypePrefix}.application.task.details`,
  notificationDetailsMsgType: `${msgTypePrefix}.notification.details`,
  msgSrc: 'ffc-sgs-admin'
}

// Validate config
const result = messageConfigSchema.validate(config, {
  abortEarly: false
})

// // Throw if config is invalid
if (result.error) {
  throw new Error(`The message config is invalid. ${result.error.message}`)
}

module.exports = result.value
