const { getYarValue } = require('../helpers/session')

function guardPage (request, guardData, rule = null) {
  let result = false
  if (guardData) {
    if (rule) {
      result = rule.condition === 'ANY' && !guardData.some(dependcyKey => getYarValue(request, dependcyKey) !== null)
    } else {
      result = guardData.filter(dependcyKey => getYarValue(request, dependcyKey) === null).length > 0
    }
  }
  return result
}

module.exports = { guardPage }
