const viewTemplate = 'equipments'
const currentPath = `/${viewTemplate}`
const { getEquipments, addRemoveItemsSessionArray } = require('../helpers/basketHelper')

function createModel (request, errorMessage) {
  return {
    equipments: getEquipments(request),
    formActionPage: currentPath,
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
    path: `${currentPath}/addremove`,
    handler: (request, h) => {
      console.log(request.payload, 'payload')
      const { isRemovable } = request.payload
      addRemoveItemsSessionArray(request, request.payload, isRemovable)
      return h.view(viewTemplate, createModel(request, null))
    }
  }
]
