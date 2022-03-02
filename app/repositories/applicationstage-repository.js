
const { Sequelize, QueryTypes } = require('sequelize')
const { models, sequelize } = require('../services/db-service')

async function getByUser (username) {
  return sequelize.query(
    `SELECT 
    "applicationstages"."id", "applicationstages"."appref", "applicationstages"."stageid", 
    "applicationstages"."created_at", "applicationstages"."updated_at", "applicationstages"."created_by", 
    "applicationstages"."updated_by", 
    "applicationstages"."status", 
      "stage"."id" AS "stage.id", "stage"."name" AS "stage.name", 
    "stage"."description" AS "stage.description", "stage"."nextid" AS "stage.nextid", 
    "stage"."businessprocessid" AS "stage.businessprocessid", "stage"."usergroups" AS "stage.usergroups", 
    "stage"."isstart" AS "stage.isstart", "stage"."active" AS "stage.active", "stage"."grant_type" AS "stage.grant_type", 
    "stage"."created_at" AS "stage.created_at", "stage"."updated_at" AS "stage.updated_at", "stage"."created_by" AS "stage.created_by", 
    "stage"."updated_by" AS "stage.updated_by", 
      "stage->businessprocess"."id" AS "stage.businessprocess.id", 
    "stage->businessprocess"."name" AS "stage.businessprocess.name", "stage->businessprocess"."description" AS "stage.businessprocess.description", 
    "stage->businessprocess"."grant_type" AS "stage.businessprocess.grant_type", 
    "stage->businessprocess"."nextid" AS "stage.businessprocess.nextid", "stage->businessprocess"."created_at" AS "stage.businessprocess.created_at", 
    "stage->businessprocess"."updated_at" AS "stage.businessprocess.updated_at", "stage->businessprocess"."created_by" AS "stage.businessprocess.created_by", 
    "stage->businessprocess"."updated_by" AS "stage.businessprocess.updated_by", 
      "applicationstageresponses"."id" AS "applicationstageresponses.id", 
    "applicationstageresponses"."applicationstageid" AS "applicationstageresponses.applicationstageid", 
    "applicationstageresponses"."remark" AS "applicationstageresponses.remark", "applicationstageresponses"."activity" AS "applicationstageresponses.activity", 
    "applicationstageresponses"."created_at" AS "applicationstageresponses.created_at", "applicationstageresponses"."updated_at" AS "applicationstageresponses.updated_at", 
    "applicationstageresponses"."created_by" AS "applicationstageresponses.created_by", 
    "applicationstageresponses"."updated_by" AS "applicationstageresponses.updated_by",
    "applicationstageresponses"."status" AS "applicationstageresponses.status",
    "usergroup".*
    FROM "public"."applicationstages" AS "applicationstages" 
  INNER JOIN "public"."stages" AS "stage" 
    ON "applicationstages"."stageid" = "stage"."id" 
  INNER JOIN "public"."businessprocesses" AS "stage->businessprocess" 
    ON "stage"."businessprocessid" = "stage->businessprocess"."id" 
  LEFT OUTER JOIN "public"."applicationstageresponses" AS "applicationstageresponses" 
    ON "applicationstages"."id" = "applicationstageresponses"."applicationstageid" 
  INNER JOIN "public"."usergroups" AS "usergroup" ON "stage"."usergroups" like '%' ||  "usergroup"."name"  ||  '%'
  WHERE "usergroup"."users" like '%' || $username || '%'  AND "applicationstageresponses"."id" is null
  ORDER BY "applicationstages"."created_at" DESC;`,
    {
      bind: { username: username },
      type: QueryTypes.SELECT,
      nest: true
    }
  )
}

async function get (id) {
  console.log(id, 'referance')
  const existingData =
        await models.applicationstages.findOne(
          {
            attributes: ['id', 'appref', 'stageid', 'created_at', 'updated_at', 'created_by', 'updated_by', 'status', 'sla', 'type', 'slaNotified', 'assignedTo'],
            where: { id: id },
            order: [['created_at', 'DESC']],
            include: [{
              model: models.stages,
              as: 'stage',
              include: [{
                model: models.businessprocesses,
                as: 'businessprocess'
              }]
            }, {
              model: models.applicationstageresponses,
              as: 'applicationstageresponses'
            }]
          })
  if (existingData) {
    console.info(`Got application: ${existingData.id}`)
  }
  return existingData
}
async function getAll () {
  const existingData =
        await models.applicationstages.findAll(
          {
            attributes: ['id', 'appref', 'stageid', 'created_at', 'updated_at', 'created_by', 'updated_by', 'status', 'sla', 'type', 'slaNotified', 'assignedTo'],
            order: [['created_at', 'DESC']],
            include: [{
              model: models.stages,
              as: 'stage',
              where: { id: Sequelize.col('applicationstages.stageid') }
            }]
          })
  if (existingData) {
    // console.info(`Got application: ${existingData}`)
  }
  return existingData
}
async function getAllForSla () {
  const existingData =
        await models.applicationstages.findAll(
          {
            attributes: ['id', 'appref', 'stageid', 'created_at', 'updated_at', 'created_by', 'updated_by', 'status', 'sla', 'type', 'slaNotified'],
            order: [['created_at', 'DESC']],
            where: {
              status: ['Pending', 'New'],
              sla: {
                [sequelize.Sequelize.Op.ne]: null
              }
            },
            include: [{
              model: models.stages,
              as: 'stage',
              include: [{
                model: models.usergroups,
                as: 'usergroup'
              }, {
                model: models.businessprocesses,
                as: 'businessprocess'
              }]
            }]
          })
  if (existingData) {
    // console.info(`Got application: ${existingData}`)
  }
  return existingData
}
async function getAllByAppRef (appref) {
  const existingData =
        await models.applicationstages.findAll(
          {
            attributes: ['id', 'appref', 'stageid', 'created_at', 'updated_at', 'created_by', 'updated_by', 'sla', 'status', 'type', 'slaNotified', 'assignedTo'],
            order: [['created_at', 'DESC']],
            where: { appref: appref },
            include: [{
              model: models.stages,
              as: 'stage',
              include: [{
                model: models.usergroups,
                as: 'usergroup'
              }, {
                model: models.businessprocesses,
                as: 'businessprocess'
              }]
            }]
          })
  if (existingData) {
    // console.info(`Got application: ${existingData}`)
  }
  return existingData
}
async function set (data) {
  // console.log(data, 'Set Repository')
  await models.applicationstages.create(data)
}
async function update (data) {
  console.log(data.sla, 'Set Repository')
  await models.applicationstages.update(
    {
      sla: JSON.stringify(data.sla),
      status: data.status,
      slaNotified: data.slaNotified ?? 0,
      updated_by: data.userName ?? 'Admin',
      updated_at: new Date(),
      assignedTo: (data.assignedTo ? JSON.stringify(data.assignedTo) : null)
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
module.exports = { get, set, getAll, getAllByAppRef, getByUser, getAllForSla, update }
