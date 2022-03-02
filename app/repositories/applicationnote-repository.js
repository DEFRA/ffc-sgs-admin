const { models } = require('../services/db-service')

async function get (id) {
  console.log(id, 'id')
  const existingData =
        await models.applicationnotes.findOne(
          {
            attributes: ['id', 'appref', 'note', 'created_at', 'updated_at', 'created_by', 'updated_by'],
            where: { id: id },
            order: [['created_at', 'DESC']]
          })
  if (existingData) {
    console.info(`Got application: ${existingData.id}`)
  }
  return existingData
}
async function getAll () {
  const existingData =
        await models.applicationnotes.findAll(
          {
            attributes: ['id', 'appref', 'note', 'created_at', 'updated_at', 'created_by', 'updated_by', 'stage'],
            order: [['created_at', 'DESC']]
          })
  if (existingData) {
    // console.info(`Got application: ${existingData}`)
  }
  return existingData
}
async function getAllByAppRef (appref) {
  const existingData =
        await models.applicationnotes.findAll(
          {
            attributes: ['id', 'appref', 'note', 'created_at', 'updated_at', 'created_by', 'updated_by'],
            order: [['created_at', 'DESC']],
            where: { appref: appref }
          })
  if (existingData) {
    // console.info(`Got application: ${existingData}`)
  }
  return existingData
}
async function set (data) {
  // console.log(data, 'Set Repository')
  await models.applicationnotes.create(data)
}
module.exports = { get, set, getAll, getAllByAppRef }
