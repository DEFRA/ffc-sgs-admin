const viewTemplate = 'forestry'
const nextPath = '/cart'
const { setYarValue, getYarValue } = require('../helpers/session')

const createModel = (request, errorMsg) => {
  return {
    businessName: getYarValue(request, 'businessDetails') ? getYarValue(request, 'businessDetails').businessName : ''
  }
}

module.exports = [{
  method: 'GET',
  path: '/forestry',
  handler: (request, h) => {
    return h.view(viewTemplate, createModel(request, null))
  }
},
{
  method: 'POST',
  path: '/forestry',
  handler: (request, h) => {
    console.log(request.payload,'forestry')
    setYarValue(request, 'forestry', request.payload)
    return h.redirect(nextPath)
  }
}]
