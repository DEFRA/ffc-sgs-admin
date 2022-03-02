const viewTemplate = 'agreement'
const { setYarValue } = require('../helpers/session')
const nextPath = '/cart'

const createModel = (request, errorMsg) => {
  return ''
}
module.exports = [{
  method: 'GET',
  path: '/agreement',
  handler: (request, h) => {
    return h.view(viewTemplate, createModel(request, null))
  }
},
{
  method: 'POST',
  path: '/agreement',
  handler: (request, h) => {
    setYarValue(request, 'agreement', request.payload)
    return h.redirect(nextPath)
  }
}]
