const { models } = require('../services/db-service')

async function get (id) {
  console.log(id, 'referance')
  const existingData =
        await models.messages.findOne(
          {
            attributes: ['id', 'appref', 'grant_type', 'data', 'subject', 'created_at', 'updated_at', 'created_by', 'updated_by'],
            where: { id: id },
            order: [['created_at', 'DESC']]
          })
  if (existingData) {
    console.info(`Got messages: ${existingData.id}`)
  }
  return existingData
}
async function getAll () {
  const existingData =
        await models.messages.findAll(
          {
            attributes: ['id', 'appref', 'grant_type', 'data', 'subject', 'created_at', 'updated_at', 'created_by', 'updated_by'],
            order: [['created_at', 'DESC']]
          })
  if (existingData) {
    console.info(`Got messages: ${existingData}`)
  }
  return existingData
}

async function getAllMessagesByAppRef (appref) {
  const existingData =
        await models.messages.findAll(
          {
            attributes: ['id', 'appref', 'grant_type', 'data', 'subject', 'created_at', 'updated_at', 'created_by', 'updated_by'],
            where: { appref: appref },
            order: [['created_at', 'DESC']]
          })
  if (existingData) {
    console.info(`Got messages: ${existingData}`)
  }
  return existingData
}

async function set (data) {
  await models.messages.create(data)
}
module.exports = { get, set, getAll, getAllMessagesByAppRef }
