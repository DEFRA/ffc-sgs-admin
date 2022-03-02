const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { isChecked, getSbiHtml, findErrorList } = require('../helpers/helper-functions')
const { NUMBER_REGEX } = require('../helpers/regex-validation')
const gapiService = require('../services/gapi-service')

const viewTemplate = 'business-details'
const currentPath = `/${viewTemplate}`
const previousPath = '/start'
const nextPath = '/farmer-details'
const detailsPath = '/check-details'

function createModel (errorList, businessDetails, sbiHtml, hasDetails) {
  const {
    projectName,
    businessName,
    numberEmployees,
    businessTurnover,
    inSbi,
    businessType,
    businessActivity,
    businessSize,
    businessAgriArea,
    businessHorticultureArea,
    businessWoodlandArea,
    businessRegisteredOwner,
    businessRegisteredOwnerGender,
    businessLandline,
    businessMobile
  } = businessDetails

  return {
    backLink: previousPath,
    checkDetail: hasDetails,
    formActionPage: currentPath,
    ...errorList ? { errorList } : {},

    inputProjectName: {
      id: 'projectName',
      name: 'projectName',
      classes: '',
      label: {
        text: 'Project name',
        classes: 'govuk-label'
      },
      hint: {
        text: 'For example, Brown Hill Farm reservoir'
      },
      ...(projectName ? { value: projectName } : {}),
      ...(errorList && errorList.some(err => err.href === '#projectName') ? { errorMessage: { text: errorList.find(err => err.href === '#projectName').text } } : {})
    },
    inputBusinessName: {
      id: 'businessName',
      name: 'businessName',
      classes: '',
      label: {
        text: 'Business name',
        classes: 'govuk-label'
      },
      hint: {
        text: 'If you’re registered on the Rural Payments system, enter business name as registered'
      },
      ...(businessType ? { value: businessType } : {}),
      ...(errorList && errorList.some(err => err.href === '#businessType') ? { errorMessage: { text: errorList.find(err => err.href === '#businessType').text } } : {})
    },
    inputBusinessType: {
      id: 'businessType',
      name: 'businessType',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Business Type',
        classes: 'govuk-label'
      },
      hint: {
        text: 'If you’re registered on the Rural Payments system, enter business type as registered'
      },
      ...(businessName ? { value: businessName } : {}),
      ...(errorList && errorList.some(err => err.href === '#businessName') ? { errorMessage: { text: errorList.find(err => err.href === '#businessName').text } } : {})
    },
    inputBusinessActivity: {
      id: 'businessActivity',
      name: 'businessActivity',
      classes: '',
      label: {
        text: 'Business Activity',
        classes: 'govuk-label'
      },
      hint: {
        text: 'If you’re registered on the Rural Payments system, enter business activity as registered'
      },
      ...(businessActivity ? { value: businessActivity } : {}),
      ...(errorList && errorList.some(err => err.href === '#businessActivity') ? { errorMessage: { text: errorList.find(err => err.href === '#businessActivity').text } } : {})
    },
    inputBusinessSize: {
      id: 'businessSize',
      name: 'businessSize',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Business Size',
        classes: 'govuk-label'
      },
      ...(businessSize ? { value: businessSize } : {}),
      ...(errorList && errorList.some(err => err.href === '#businessSize') ? { errorMessage: { text: errorList.find(err => err.href === '#businessSize').text } } : {})
    },
    inputBusinessAgriArea: {
      id: 'businessAgriArea',
      name: 'businessAgriArea',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Business Agriculture Area',
        classes: 'govuk-label'
      },
      ...(businessAgriArea ? { value: businessAgriArea } : {}),
      ...(errorList && errorList.some(err => err.href === '#businessAgriArea') ? { errorMessage: { text: errorList.find(err => err.href === '#businessAgriArea').text } } : {})
    },
    inputBusinessHorticultureArea: {
      id: 'businessHorticultureArea',
      name: 'businessHorticultureArea',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Business Horticulture Area',
        classes: 'govuk-label'
      },
      ...(businessHorticultureArea ? { value: businessHorticultureArea } : {}),
      ...(errorList && errorList.some(err => err.href === '#businessHorticultureArea') ? { errorMessage: { text: errorList.find(err => err.href === '#businessHorticultureArea').text } } : {})
    },
    inputBusinessWoodlandArea: {
      id: 'businessWoodlandArea',
      name: 'businessWoodlandArea',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Business woodland area',
        classes: 'govuk-label'
      },
      ...(businessWoodlandArea ? { value: businessWoodlandArea } : {}),
      ...(errorList && errorList.some(err => err.href === '#businessWoodlandArea') ? { errorMessage: { text: errorList.find(err => err.href === '#businessWoodlandArea').text } } : {})
    },
    inputBusinessRegisteredOwner: {
      id: 'businessRegisteredOwner',
      name: 'businessRegisteredOwner',
      classes: '',
      label: {
        text: 'Business Registered Owner',
        classes: 'govuk-label'
      },
      ...(businessRegisteredOwner ? { value: businessRegisteredOwner } : {}),
      ...(errorList && errorList.some(err => err.href === '#businessRegisteredOwner') ? { errorMessage: { text: errorList.find(err => err.href === '#businessRegisteredOwner').text } } : {})
    },
    inputBusinessRegisteredOwnerGender: {
      id: 'businessRegisteredOwnerGender',
      name: 'businessRegisteredOwnerGender',
      classes: 'govuk-input--width-10',
      label: {
        text: 'Business Regigered owner gender',
        classes: 'govuk-label'
      },
      ...(businessRegisteredOwnerGender ? { value: businessRegisteredOwnerGender } : {}),
      ...(errorList && errorList.some(err => err.href === '#businessRegisteredOwnerGender') ? { errorMessage: { text: errorList.find(err => err.href === '#businessRegisteredOwnerGender').text } } : {})
    },
    inputBusinessLandline: {
      id: 'businessLandline',
      name: 'businessLandline',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Business landline',
        classes: 'govuk-label'
      },
      ...(businessLandline ? { value: businessLandline } : {}),
      ...(errorList && errorList.some(err => err.href === '#businessLandline') ? { errorMessage: { text: errorList.find(err => err.href === '#businessLandline').text } } : {})
    },
    inputBusinessMobile: {
      id: 'businessMobile',
      name: 'businessMobile',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Business mobile',
        classes: 'govuk-label'
      },
      ...(businessMobile ? { value: businessMobile } : {}),
      ...(errorList && errorList.some(err => err.href === '#businessMobile') ? { errorMessage: { text: errorList.find(err => err.href === '#businessMobile').text } } : {})
    },
    inputNumberEmployees: {
      id: 'numberEmployees',
      name: 'numberEmployees',
      classes: 'govuk-input--width-10',
      label: {
        text: 'Number of employees',
        classes: 'govuk-label'
      },
      hint: {
        text: 'Full-time employees, including the owner'
      },
      ...(numberEmployees ? { value: numberEmployees } : {}),
      ...(errorList && errorList.some(err => err.href === '#numberEmployees') ? { errorMessage: { text: errorList.find(err => err.href === '#numberEmployees').text } } : {})
    },
    inputBusinessTurnover: {
      id: 'businessTurnover',
      name: 'businessTurnover',
      classes: 'govuk-input--width-10',
      prefix: {
        text: '£'
      },
      label: {
        text: 'Business turnover (£)',
        classes: 'govuk-label'
      },
      ...(businessTurnover ? { value: businessTurnover } : {}),
      ...(errorList && errorList.some(err => err.href === '#businessTurnover') ? { errorMessage: { text: errorList.find(err => err.href === '#businessTurnover').text } } : {})
    },
    radios: {
      idPrefix: 'inSbi',
      name: 'inSbi',
      hint: {
        text: 'If you do not have an SBI, you will need to get one for full application'
      },
      fieldset: {
        legend: {
          text: 'Single Business Identifier (SBI)',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m'
        }
      },
      items: [
        {
          value: 'Yes',
          text: 'Yes',
          conditional: {
            html: sbiHtml
          },
          checked: isChecked(inSbi, 'Yes')
        },
        {
          value: 'No',
          text: 'No',
          checked: isChecked(inSbi, 'No')
        }
      ],
      ...(errorList && errorList.some(err => err.href === '#inSbi') ? { errorMessage: { text: errorList.find(err => err.href === '#inSbi').text } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: async (request, h) => {
      let businessDetails = getYarValue(request, 'businessDetails') || null
      await gapiService.sendDimensionOrMetrics(request, [{
        dimensionOrMetric: gapiService.dimensions.SCORE,
        value: getYarValue(request, 'current-score')
      },
      {
        dimensionOrMetric: gapiService.metrics.SCORE,
        value: 'TIME'
      }])
      if (!businessDetails) {
        businessDetails = {
          projectName: null,
          businessName: null,
          numberEmployees: null,
          businessTurnover: null,
          sbi: null,
          inSbi: false,
          businessType: null,
          businessActivity: null,
          businessSize: null,
          businessAgriArea: null,
          businessHorticultureArea: null,
          businessWoodlandArea: null,
          businessRegisteredOwner: null,
          businessRegisteredOwnerGender: null,
          businessLandline: null,
          businessMobile: null
        }
      }
      const inSbi = businessDetails.inSbi ?? null
      const sbiData = inSbi !== null ? businessDetails.sbi : null
      const sbiHtml = getSbiHtml(sbiData)

      return h.view(viewTemplate, createModel(null, businessDetails, sbiHtml, getYarValue(request, 'checkDetails')))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        options: { abortEarly: false },
        payload: Joi.object({
          projectName: Joi.string().required(),
          businessName: Joi.string().max(100).required(),
          numberEmployees: Joi.string().regex(NUMBER_REGEX).max(7).required(),
          businessTurnover: Joi.string().regex(NUMBER_REGEX).max(9).required(),
          sbi: Joi.string().regex(NUMBER_REGEX).min(9).max(9).allow(''),
          inSbi: Joi.string().required(),
          businessType: Joi.string().required(),
          businessActivity: Joi.string().required(),
          businessSize: Joi.string().required(),
          businessAgriArea: Joi.string().required(),
          businessHorticultureArea: Joi.string().required(),
          businessWoodlandArea: Joi.string().required(),
          businessRegisteredOwner: Joi.string().required(),
          businessRegisteredOwnerGender: Joi.string().required(),
          businessLandline: Joi.string().required(),
          businessMobile: Joi.string().required(),
          results: Joi.any()
        }),
        failAction: (request, h, err) => {
          const errorList = []
          let sbiError
          const fields = ['projectName', 'businessName', 'numberEmployees', 'businessTurnover', 'inSbi', 'sbi']
          fields.forEach(field => {
            const fieldError = findErrorList(err, [field])[0]
            if (fieldError) {
              if (field === 'sbi') {
                sbiError = { text: fieldError, href: `#${field}` }
              }
              errorList.push({
                text: fieldError,
                href: `#${field}`
              })
            }
          })

          const {
            projectName, businessName, numberEmployees, businessTurnover, sbi, inSbi,
            businessType,
            businessActivity,
            businessSize,
            businessAgriArea,
            businessHorticultureArea,
            businessWoodlandArea,
            businessRegisteredOwner,
            businessRegisteredOwnerGender,
            businessLandline,
            businessMobile
          } = request.payload
          const businessDetails = {
            projectName,
            businessName,
            numberEmployees,
            businessTurnover,
            sbi,
            inSbi,
            businessType,
            businessActivity,
            businessSize,
            businessAgriArea,
            businessHorticultureArea,
            businessWoodlandArea,
            businessRegisteredOwner,
            businessRegisteredOwnerGender,
            businessLandline,
            businessMobile
          }
          const sbiHtml = getSbiHtml(sbi, sbiError)

          return h.view(viewTemplate, createModel(errorList, businessDetails, sbiHtml, getYarValue(request, 'checkDetails'))).takeover()
        }
      },
      handler: (request, h) => {
        const {
          projectName, businessName, numberEmployees, businessTurnover, sbi, results, inSbi,
          businessType,
          businessActivity,
          businessSize,
          businessAgriArea,
          businessHorticultureArea,
          businessWoodlandArea,
          businessRegisteredOwner,
          businessRegisteredOwnerGender,
          businessLandline,
          businessMobile
        } = request.payload
        if (inSbi === 'Yes' && sbi === '') {
          const sbiError = { text: 'Enter an SBI number, like 011115678', href: '#sbi' }
          const sbiHtml = getSbiHtml(sbi, sbiError)

          return h.view(viewTemplate, createModel([sbiError], request.payload, sbiHtml, getYarValue(request, 'checkDetails')))
        }

        setYarValue(request, 'businessDetails', {
          projectName,
          businessName,
          numberEmployees,
          businessTurnover,
          sbi,
          inSbi,
          businessType,
          businessActivity,
          businessSize,
          businessAgriArea,
          businessHorticultureArea,
          businessWoodlandArea,
          businessRegisteredOwner,
          businessRegisteredOwnerGender,
          businessLandline,
          businessMobile
        })

        return results ? h.redirect(detailsPath) : h.redirect(nextPath)
      }
    }
  }
]
