const viewTemplate = 'livestock'
const nextPath = '/forestry'
const { setYarValue, getYarValue } = require('../helpers/session')

const createModel = (request, errorMsg) => {
  return {
    businessName: getYarValue(request, 'businessDetails') ? getYarValue(request, 'businessDetails').businessName : ''
  }
}
module.exports = [{
  method: 'GET',
  path: '/livestock',
  handler: (request, h) => {
    return h.view(viewTemplate, createModel(request, null))
  }
},
{
  method: 'POST',
  path: '/livestock',
  handler: (request, h) => {
    console.log(request.payload, 'livestock payload')
    setYarValue(request, 'liveStock', request.payload)
    return h.redirect(nextPath)
  }
}]
