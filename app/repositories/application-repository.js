
const { QueryTypes } = require('sequelize')
const { models, sequelize } = require('../services/db-service')

async function getApplicationForStatusUpdate (appref) {
  return sequelize.query(`select total.appref, total, approved, rejected, pendingnew from 
  (select appref, count(1) Total from applicationstages
  where appref =$appref group by appref) as Total
  left join 
  (select appref, count(1) Approved from applicationstages
  where appref =$appref and status='Approved' group by appref) as Approved
  on Total.appref = Approved.appref
  left join 
  (select appref, count(1) PendingNew from applicationstages
  where appref =$appref and status in ('New','Pending') group by appref) as PendingNew
  on Total.appref = PendingNew.appref
  left join 
  (select appref, count(1) Rejected from applicationstages
  where appref =$appref and status in ('Rejected') group by appref) as Rejected
  on Total.appref = Rejected.appref
  `,
  {
    bind: { appref: appref },
    type: QueryTypes.SELECT,
    nest: true
  }
  )
}
async function getAllForStatusUpdate () {
  return models.applications.findAll(
    {
      attributes: ['id', 'reference', 'grant_type', 'data', 'created_at', 'status'],
      where: { status: ['Pending', 'New'] },
      order: [['created_at', 'DESC']]
    })
}
async function get (ref) {
  console.log(ref, 'referance')
  const existingData =
        await models.applications.findOne(
          {
            attributes: ['id', 'reference', 'grant_type', 'data', 'created_at', 'status'],
            where: { reference: ref },
            order: [['created_at', 'DESC']]
          })
  if (existingData) {
    console.info(`Got application: ${existingData.id}`)
  }
  return existingData
}
async function getAll (page = 0) {
  const existingData =
        await models.applications.findAll(
          {
            attributes: ['id', 'reference', 'grant_type', 'data', 'created_at', 'status'],
            order: [['created_at', 'DESC']],
            limit: 20,
            offset: 0
          })
  if (existingData) {
    // console.info(`Got application: ${existingData}`)
  }
  return existingData
}
async function set (data) {
  // console.log(data, 'Set Repository')
  await models.applications.create(data)
}
async function updateStatus (data) {
  console.log(data.status, 'Update Status')
  await models.applications.update(
    {
      status: data.status,
      updated_by: data.userName ?? 'Admin',
      updated_at: new Date()
    },
    { where: { id: data.id } }
  )
  // .success(result =>
  //   handleResult(result)
  // )
  // .error(err =>
  //   handleError(err)
  // )
}
module.exports = { get, set, getAll, getAllForStatusUpdate, getApplicationForStatusUpdate, updateStatus }
