const { models } = require('../services/db-service')

async function get (key) {
  console.log(key, 'referance')
  const existingData =
        await models.grants.findOne(
          {
            attributes: ['key', 'grant_type', 'data', 'name', 'description', 'maxgrantamount', 'mingrantamount', 'created_at', 'updated_at', 'created_by', 'updated_by'],
            where: { key: key },
            order: [['created_at', 'DESC']]
          })
  if (existingData) {
    console.info(`Got grants: ${existingData.id}`)
  }
  return existingData
}
async function getAll () {
  const existingData =
        await models.grants.findAll(
          {
            attributes: ['key', 'grant_type', 'data', 'name', 'description', 'maxgrantamount', 'mingrantamount', 'created_at', 'updated_at', 'created_by', 'updated_by'],
            order: [['created_at', 'DESC']]
          })
  if (existingData) {
    console.info(`Got grants: ${existingData}`)
  }
  return existingData
}
async function set (data) {
  await models.grants.create(data)
}
module.exports = { get, set, getAll }
