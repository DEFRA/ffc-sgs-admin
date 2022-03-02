
const { getAllForSla, update } = require('../repositories/applicationstage-repository')
const { get, getApplicationForStatusUpdate, updateStatus, getAllForStatusUpdate } = require('../repositories/application-repository')
const senders = require('../messaging/senders')
function addMinutes (date, minutes) {
  return new Date(date.getTime() + minutes * 60000)
}

const getApplication = async (ref) => {
  const a = await get(ref)
  const appDetails = JSON.parse(a.data)
  return {
    ref: a.reference,
    email: a.email,
    farmerCRN: appDetails.crn,
    livestock: appDetails.liveStock,
    agreement: appDetails.agreement,
    businessDetails: appDetails.businessDetails,
    farmerDetails: appDetails.farmerDetails
  }
}

const getMessage = async (applicationStage, expireOnString) => {
  const app = await getApplication(applicationStage.appref)
  return {
    ref: app.ref,
    notifyTemplate: '8a27798d-b2d6-4a58-b719-78937fe81024',
    emailAddress: app.farmerDetails.email,
    details: {
      referenceNumber: app.ref,
      firstName: app.farmerDetails.firstName,
      lastName: app.farmerDetails.lastName,
      email: app.farmerDetails.email,
      farmerName: app.farmerDetails.firstName,
      farmerSurname: app.farmerDetails.lastName,
      farmerEmail: app.farmerDetails.email,
      projectName: app.businessDetails.projectName,
      businessName: app.businessDetails.businessName,
      contactConsent: app.agreement.declaration,
      scoreDate: (new Date()).toLocaleDateString(),
      actionLink: `http://localhost:3800/applicationstages/${app.ref}/${applicationStage.stageId}/response`,
      isProcessStage: 'Yes',
      businessProcessName: applicationStage.stage.businessprocess.name,
      stageName: applicationStage.stage.name,
      slaExpireOn: expireOnString,
      isSla: 'Yes'
    }
  }
}

const sendNotification = async (message, appref) => {
  try {
    await senders.sendNotificationDetails(message, appref)
  } catch (err) {
    console.log('ERROR: ', err)
  }
}
const slaEvaluator = async (item) => {
  const { created_at, sla } = item
  let isExpired = false
  if (sla.reminder) {
    // check is expired
    if (sla.expireon) {
      const expireOnHrs = parseInt(sla.expireon.replace('HR', ''))
      const evalExpireOn = addMinutes(created_at, expireOnHrs * (60))
      if (evalExpireOn <= new Date() && !isExpired) {
        isExpired = sla.onexpire.isreject === 'true'
        if (isExpired) {
          console.log(evalExpireOn, sla.onexpire.isreject, 'isreject')
          item.status = 'Rejected'
          await update(item)
        }
      }
    }
    if (!isExpired) {
      let notificationSent = false
      const slaHrs = sla.reminder.map(rem => parseFloat(rem.replace('HR', '')))
      slaHrs.sort((a, b) => b - a)
      slaHrs.forEach(async hrs => {
        if (!notificationSent) {
          const evalCreatedOn = addMinutes(created_at, hrs * (60))
          if (evalCreatedOn <= new Date()) {
            notificationSent = true
            // Get notification details and send it.
            const message = await getMessage(item, `${evalCreatedOn.toLocaleDateString()} ${evalCreatedOn.toLocaleTimeString()}`)
            await sendNotification(message, item.appref)
            item.sla.reminder = sla.reminder.filter(f => f.toString() !== `${hrs}HR`)
            item.slaNotified = true
            await update(item)
          }
        }
      })
    }
  }
}
const getAllSlaTasks = async () => {
  await updateApplicationStatus()
  const tasks = await getAllForSla()
  tasks.forEach(async item => {
    await slaEvaluator(item)
  })
}
const updateApplicationStatus = async () => {
  const apps = await getAllForStatusUpdate()
  // console.log('updateApplicationStatus', apps.length)
  if (apps && apps.length > 0) {
    apps.forEach(async app => {
      const appStatusResult = await getApplicationForStatusUpdate(app.reference)
      let status = ''
      if (appStatusResult && appStatusResult.length > 0) {
        const appStatusData = appStatusResult[0]
        if (appStatusData.pendingnew === null) {
          if ((appStatusData.approved ?? 0) === appStatusData.total) {
            status = 'Approved'
          }
          if ((appStatusData.rejected ?? 0) > 0) {
            status = 'Rejected'
          }
        }
      }
      // else {
      //   status = 'Approved'
      // }

      if (status !== '') {
        await updateStatus({
          id: app.id,
          status
        })
      }
    })
  }
}
module.exports = {
  getAllSlaTasks,
  sendNotification,
  updateApplicationStatus
}
