const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { getErrorList } = require('../helpers/helper-functions')
const { NAME_REGEX, PHONE_REGEX, POSTCODE_REGEX, DELETE_POSTCODE_CHARS_REGEX } = require('../helpers/regex-validation')
const { getDetailsInput } = require('../helpers/detailsInputs')
const gapiService = require('../services/gapi-service')

const viewTemplate = 'model-farmer-agent-details'
const currentPath = '/farmer-details'
const nextPath = '/check-details'
const agentDetailsPath = '/agent-details'
const applyingPath = '/business-details'

function createModel (errorList, farmerDetails, backLink, hasDetails) {
  return {
    backLink,
    pageId: 'Farmer',
    formActionPage: currentPath,
    pageHeader: 'Farmer\'s details',
    checkDetail: hasDetails,
    ...errorList ? { errorList } : {},
    ...getDetailsInput(farmerDetails, errorList)
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: async (request, h) => {
      let farmerDetails = getYarValue(request, 'farmerDetails') || null
      if (!farmerDetails) {
        farmerDetails = {
          firstName: null,
          lastName: null,
          email: null,
          mobile: null,
          landline: null,
          address1: null,
          address2: null,
          town: null,
          county: null,
          postcode: null
        }
      }

      const applying = getYarValue(request, 'applying')
      await gapiService.sendDimensionOrMetric(request, {
        dimensionOrMetric: gapiService.dimensions.AGENTFORMER,
        value: applying
      })
      const backLink = '/cart'
      return h.view(viewTemplate, createModel(null, farmerDetails, backLink, getYarValue(request, 'checkDetails')))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        options: { abortEarly: false },
        payload: Joi.object({
          firstName: Joi.string().regex(NAME_REGEX).required(),
          lastName: Joi.string().regex(NAME_REGEX).required(),
          email: Joi.string().email().required(),
          mobile: Joi.string().regex(PHONE_REGEX).min(10).allow(''),
          landline: Joi.string().regex(PHONE_REGEX).min(10).allow(''),
          address1: Joi.string().required(),
          address2: Joi.string().required(),
          town: Joi.string().allow(''),
          county: Joi.string().required(),
          postcode: Joi.string().replace(DELETE_POSTCODE_CHARS_REGEX, '').regex(POSTCODE_REGEX).trim().required(),
          results: Joi.any()
        }),
        failAction: async (request, h, err) => {
          const phoneErrors = []
          if (request.payload.landline === '' && request.payload.mobile === '') {
            phoneErrors.push({ text: 'Enter your mobile number', href: '#mobile' })
            phoneErrors.push({ text: 'Enter your landline number', href: '#landline' })
          }

          const errorList = getErrorList(['firstName', 'lastName', 'email', 'mobile', 'landline', 'address1', 'address2', 'town', 'county', 'postcode'], err, phoneErrors)
          const { firstName, lastName, email, mobile, landline, address1, address2, town, county, postcode } = request.payload
          const farmerDetails = { firstName, lastName, email, mobile, landline, address1, address2, town, county, postcode }
          const applying = getYarValue(request, 'applying')
          const backLink = applying === 'Agent' ? agentDetailsPath : applyingPath
          await request.ga.pageView()

          return h.view(viewTemplate, createModel(errorList, farmerDetails, backLink, getYarValue(request, 'checkDetails'))).takeover()
        }
      },
      handler: async (request, h) => {
        const {
          firstName, lastName, email, mobile, landline, address1, address2, town, county, postcode
        } = request.payload

        const phoneErrors = [
          { text: 'Enter your mobile number', href: '#mobile' },
          { text: 'Enter your landline number', href: '#landline' }
        ]

        if (!landline && !mobile) {
          await request.ga.pageView()
          return h.view(viewTemplate, createModel(phoneErrors, {
            firstName, lastName, email, mobile, landline, address1, address2, town, county, postcode
          }, getYarValue(request, 'checkDetails'))).takeover()
        }

        setYarValue(request, 'farmerDetails', {
          firstName, lastName, email, mobile, landline, address1, address2, town, county, postcode: postcode.split(/(?=.{3}$)/).join(' ').toUpperCase()
        })

        return h.redirect(nextPath)
      }
    }
  }
]
