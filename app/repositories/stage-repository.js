const { models } = require('../services/db-service')

async function get (id) {
  console.log(id, 'referance')
  const existingData =
        await models.stages.findOne(
          {
            attributes: ['id', 'name', 'description', 'nextid', 'businessprocessid', 'usergroups', 'grant_type', 'isstart', 'active', 'created_at'],
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
        await models.stages.findAll(
          {
            attributes: ['id', 'name', 'description', 'nextid', 'businessprocessid', 'usergroups', 'grant_type', 'isstart', 'active', 'created_at'],
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
  await models.stages.create(data)
}
module.exports = { get, set, getAll }
