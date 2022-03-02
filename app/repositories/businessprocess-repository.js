const { models } = require('../services/db-service')

async function get (id) {
  console.log(id, 'referance')
  const existingData =
        await models.businessprocesses.findOne(
          {
            attributes: ['id', 'name', 'description', 'nextid', 'grant_type', 'created_at', 'updated_at', 'created_by', 'updated_by'],
            where: { id: id },
            order: [['created_at', 'DESC']],
            include: [{
              model: models.businessprocesses,
              as: 'businessprocess'
            }]
          })
  if (existingData) {
    console.info(`Got application: ${existingData.id}`)
  }
  return existingData
}
async function getAll () {
  const existingData =
        await models.businessprocesses.findAll(
          {
            attributes: ['id', 'name', 'description', 'nextid', 'grant_type', 'created_at', 'updated_at', 'created_by', 'updated_by'],
            order: [['created_at', 'DESC']],
            include: [{
              model: models.businessprocesses,
              as: 'businessprocess'
            }]
          })
  if (existingData) {
    console.info(`Got stage: ${existingData}`)
  }
  return existingData
}
async function set (data) {
  await models.businessprocesses.create(data)
}
module.exports = { get, set, getAll }
