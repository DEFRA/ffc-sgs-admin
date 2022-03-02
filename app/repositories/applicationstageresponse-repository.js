const { models } = require('../services/db-service')

async function get (ref) {
  console.log(ref, 'referance')
  const existingData =
        await models.applicationstageresponses.findOne(
          {
            attributes: ['id', 'applicationstageid', 'remark', 'activity', 'created_at', 'updated_at', 'created_by', 'updated_by'],
            where: { reference: ref },
            order: [['created_at', 'DESC']],
            include: [{
              model: models.applicationstages,
              as: 'applicationstage'
            }]
          })
  if (existingData) {
    console.info(`Got application: ${existingData.id}`)
  }
  return existingData
}
async function getAll () {
  const existingData =
        await models.applicationstageresponses.findAll(
          {
            attributes: ['id', 'applicationstageid', 'remark', 'activity', 'created_at', 'updated_at', 'created_by', 'updated_by', 'stage'],
            order: [['created_at', 'DESC']],
            include: [{
              model: models.applicationstages,
              as: 'applicationstage'
            }]
          })
  if (existingData) {
    // console.info(`Got application: ${existingData}`)
  }
  return existingData
}
async function getAllByAppRef (id) {
  const existingData =
        await models.applicationstageresponses.findAll(
          {
            attributes: ['id', 'applicationstageid', 'remark', 'activity', 'created_at', 'updated_at', 'created_by', 'updated_by'],
            order: [['created_at', 'DESC']],
            where: { id: id },
            include: [{
              model: models.applicationstages,
              as: 'applicationstage'
            }]
          })
  if (existingData) {
    // console.info(`Got application: ${existingData}`)
  }
  return existingData
}
async function set (data) {
  // console.log(data, 'Set Repository')
  await models.applicationstageresponses.create(data)
}
module.exports = { get, set, getAll, getAllByAppRef }
