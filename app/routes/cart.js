const viewTemplate = 'cart'
const currentPath = `/${viewTemplate}`
const { getSelectedEquipments } = require('../helpers/basketHelper')
const { getYarValue } = require('../helpers/session')
const nextPath = '/check-details'

function createModel (request, errorMessage) {
  const selectedEquipments = getSelectedEquipments(request)
  return {
    equipments: selectedEquipments,
    grandTotal: selectedEquipments.reduce((total, item) => {
      return total + parseInt(item.quantity) * parseFloat(item.grantAmount)
    }, 0),
    formActionPage: currentPath,
    applicationStatus: getYarValue(request, 'farmerDetails') ? 'Completed' : 'Not Completed',
    liveStockStatus: getYarValue(request, 'liveStock') ? 'Completed' : 'Not Completed',
    forestryStatus: getYarValue(request, 'forestry') ? 'Completed' : 'Not Completed',
    agreementStatus: getYarValue(request, 'agreement') ? 'Completed' : 'Not Completed',
    businessName: getYarValue(request, 'businessDetails') ? getYarValue(request, 'businessDetails').businessName : '',
    errorMessage
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      return h.view(viewTemplate, createModel(request, null))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    handler: (request, h) => {
      return h.redirect(nextPath)
    }
  }
]
