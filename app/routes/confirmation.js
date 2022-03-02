const { formatApplicationCode } = require('../helpers/helper-functions')
const createMsg = require('../messaging/create-msg')
const gapiService = require('../services/gapi-service')
const { appInsights } = require('ffc-messaging')
const { getYarValue } = require('../helpers/session')

const viewTemplate = 'confirmation'
const currentPath = '/confirmation'
const startPath = '/cart'

module.exports = {
  method: 'GET',
  path: currentPath,
  handler: async (request, h) => {
    if (!getYarValue(request, 'farmerDetails')) {
      return h.redirect(startPath)
    }
    const confirmationId = formatApplicationCode(request.yar.id)

    try {
      console.log(createMsg.getAllDetails(request, confirmationId), 'application details')
      request.yar.reset()
      return h.view(viewTemplate, {
        output: {
          titleText: 'Details submitted',
          html: `Your reference number<br><strong>${confirmationId}</strong>`,
          surveyLink: process.env.SURVEY_LINK,
          confirmationId: confirmationId
        }
      })
    } catch (err) {
      appInsights.logException(null, { error: err })
      await gapiService.sendEvent(request, gapiService.categories.CONFIRMATION, 'Error')
      return h.view('500')
    }
  }
}
