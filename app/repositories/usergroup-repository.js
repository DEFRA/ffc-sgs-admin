const { models } = require('../services/db-service')

async function get (name) {
  console.log(name, 'referance')
  const existingData =
        await models.usergroups.findOne(
          {
            attributes: ['name', 'users', 'created_at', 'created_by'],
            where: { name: name },
            order: [['created_at', 'DESC']]
          })
  if (existingData) {
    console.info(`Got application: ${existingData.name}`)
  }
  return existingData
}
async function getAll () {
  const existingData =
        await models.usergroups.findAll(
          {
            attributes: ['name', 'users', 'created_at', 'created_by'],
            order: [['created_at', 'DESC']]
          })
  if (existingData) {
    console.info(`Got usergroup: ${existingData}`)
  }
  return existingData
}
async function set (data) {
  await models.usergroups.create(data)
}
module.exports = { get, set, getAll }
