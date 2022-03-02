const equipments = require('../../config/equipmentItems.json')

module.exports = {
  method: 'GET',
  path: '/api/equipmentItems',
  handler: (request, h) => {
    return h.response(equipments)
      .header('cache-control', 'no-cache')
      .type('application/vnd.api+json').code(200)
  }
}
