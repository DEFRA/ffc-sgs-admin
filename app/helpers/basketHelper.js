const equipmentItems = require('../config/equipmentItems.json')
const { getYarValue, setYarValue } = require('../helpers/session')
const yarKey = 'selectedEquipments'
const getEquipments = (request) => {
  const result = []
  let selectedQuantity = 1
  let itemAdded = false
  const yarVal = getYarValue(request, yarKey) ?? []
  equipmentItems.forEach(item => {
    selectedQuantity = 0
    itemAdded = false
    if (yarVal && yarVal.filter(i => i.id === item.id).length > 0) {
      selectedQuantity = yarVal.filter(i => i.id === item.id)[0].quantity
      itemAdded = true
    }
    const quantityLookup = []
    let count = 1
    while (item.maxQuantity >= count) {
      const isSelected = count.toString() === selectedQuantity.toString()
      quantityLookup.push({
        value: count,
        text: count,
        selected: isSelected
      })
      count++
    }
    result.push({ ...item, added: itemAdded, quantity: selectedQuantity, quantities: quantityLookup })
  })
  return result
}

function getSelectedEquipments (request) {
  const yarVal = getYarValue(request, yarKey) ?? []
  const result = []
  equipmentItems.forEach(item => {
    if (yarVal && yarVal.filter(i => i.id === item.id).length > 0) {
      const selectedQuantity = yarVal.filter(i => i.id === item.id)[0].quantity
      const itemAdded = true
      result.push({ ...item, added: itemAdded, quantity: selectedQuantity, quantities: null })
    }
  })
  return result
}

function addRemoveItemsSessionArray (request, item, remove = false) {
  let yarVal = getYarValue(request, yarKey) ?? []
  if (yarVal && yarVal.filter(i => i.id === item.id).length > 0) {
    if (remove) {
      yarVal = yarVal.map(i => {
        if (i.id === item.id) {
          i.quantity--
        }
        return i
      })
      // in case we end up with zero quantity
      yarVal = yarVal.filter(i => i.quantity > 0)
    } else {
      yarVal = yarVal.map(i => {
        if (i.id === item.id) {
          i.quantity = item.quantity
        }
        return i
      })
    }
  } else {
    if (remove !== true) {
      console.log('is in', remove)
      yarVal.push({ id: item.id, quantity: item.quantity })
    }
  }
  setYarValue(request, yarKey, yarVal)
}
module.exports = {
  getEquipments,
  getSelectedEquipments,
  addRemoveItemsSessionArray
}
