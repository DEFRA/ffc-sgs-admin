const createMsg = require('../messaging/create-msg')
const { setYarValue, getYarValue } = require('../helpers/session')
const { getSelectedEquipments } = require('../helpers/basketHelper')

const viewTemplate = 'check-details'
const currentPath = `/${viewTemplate}`
const previousPath = '/farmer-details'
const nextPath = '/confirmation'
const businessDetailsPath = '/business-details'
const farmerDetailsPath = previousPath
function getForestrySummary (request) {
  const forestryInfo = getYarValue(request, 'forestry')
  if (forestryInfo && forestryInfo.forestry.length > 0) {
    const result = []
    forestryInfo.forestry.forEach(item => {
      result.push({
        key: {
          text: item
        },
        value: {
          text: ''
        }
      })
    })
    return result
  } else {
    return []
  }
}
function createModel (request, data) {
  const selectedEquipments = getSelectedEquipments(request)
  console.log(getYarValue(request, 'liveStock'), 'livestock')
  const model = {
    equipments: selectedEquipments.length <= 0 ? null : selectedEquipments,
    grandTotal: selectedEquipments.reduce((total, item) => {
      return total + parseInt(item.quantity) * parseFloat(item.grantAmount)
    }, 0),
    livestock: getYarValue(request, 'liveStock'),
    forestry: getForestrySummary(request),
    agreement: getYarValue(request, 'agreement'),
    businessDetailsLink: businessDetailsPath,
    farmerDetailsLink: farmerDetailsPath,
    businessDetails: data.businessDetails,
    farmerDetails: data.farmerDetails.firstName + ' ' + data.farmerDetails.lastName,
    farmerPostCode: data.farmerDetails.postcode,
    farmerAddressDetails: `${data.farmerDetails.address1}${(data.farmerDetails.address2 ?? '').length > 0 ? '<br/>' : ''}${data.farmerDetails.address2}<br/>${data.farmerDetails.town}<br/>${data.farmerDetails.county}<br/>${data.farmerDetails.postcode}`,
    farmerContactDetails: `${data.farmerDetails.email}${(data.farmerDetails.landline ?? '').length > 0 ? '<br/>' : ''}${data.farmerDetails.landline}<br/>${data.farmerDetails.mobile}`
  }
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...model
  }
}

module.exports = [{
  method: 'GET',
  path: currentPath,
  options: {
    log: {
      collect: true
    }
  },
  handler: (request, h, err) => {
    const msg = createMsg.getAllDetails(request, '')
    msg.farmerDetails = getYarValue(request, 'farmerDetails')
    setYarValue(request, 'checkDetails', 'true')
    return h.view(viewTemplate, createModel(request, msg))
  }
},
{
  method: 'POST',
  path: currentPath,
  handler: (request, h) => {
    return h.redirect(nextPath)
  }
}]
