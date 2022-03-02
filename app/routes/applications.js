const viewTemplate = 'applications'
const currentPath = `/${viewTemplate}`
const { getAll, get } = require('../repositories/application-repository')
const appNoteRepository = require('../repositories/applicationnote-repository')
const sharepoint = require('../services/sharepoint')
const { getAllByAppRef } = require('../repositories/applicationstage-repository')
const messageRepository = require('../repositories/message-repository')
async function createModel (request, errorMessage) {
  const apps = await getAll()
  const applications = apps.map(item => {
    const dataObject = JSON.parse(item.data)
    let statusClass = ''
    switch (item.status) {
      case 'Pending':
        statusClass = 'govuk-tag--grey'
        break
      case 'New':
        statusClass = 'govuk-tag--blue'
        break
      case 'Rejected':
        statusClass = 'govuk-tag--red'
        break
    }
    return ([
      {
        html: `<input type="checkbox" name="appid" id="appid" value="${item.reference}"/>`
      },
      {
        html: `<a href='/applications/${item.reference}'>${item.reference}</a>`
      },
      {
        text: item.grant_type
      },
      {
        text: dataObject.farmerDetails.firstName + ' ' + dataObject.farmerDetails.lastName
      },
      {
        text: item.created_at.toLocaleDateString('en-GB')
      },
      {
        html: `<strong class="govuk-tag ${statusClass}">${item.status}</strong>`
      }
    ]
    )
  })

  return {
    applications: applications,
    formActionPage: currentPath,
    errorMessage
  }
}
async function createStageModel (errorMessage, applicationRef) {
  const apps = await getAllByAppRef(applicationRef)
  const applicationstages = apps.map(item => {
    const slaHrs = item.sla.reminder.join(',')
    let statusClass = ''
    switch (item.status) {
      case 'Pending':
        statusClass = 'govuk-tag--grey'
        break
      case 'New':
        statusClass = 'govuk-tag--blue'
        break
      case 'Rejected':
        statusClass = 'govuk-tag--red'
        break
    }
    return ([
      {
        html: `${item.type ?? 'Multiple'} Approver`
      },
      {
        html: `<a href='/applicationstages/${item.appref}/${item.id}'>${item.stage.name}</a>`
      },
      {
        html: item.stage.usergroups
      },
      {
        html: item.stage.businessprocess.name
      },
      {
        html: `Expire On : ${item.sla.expireon} <br/>SLA : ${slaHrs} <br/> Is Reject on Expire : ${item.sla.onexpire ? item.sla.onexpire.isreject : 'No'}`
      },
      {
        html: `<strong class="govuk-tag ${statusClass}">${item.status}</strong>`
      },
      {
        text: `${item.created_at.toLocaleDateString('en-GB')} ${item.created_at.toLocaleTimeString('en-GB')}`
      }
    ]
    )
  })
  return {
    applicationstages: applicationstages,
    formActionPage: currentPath,
    errorMessage
  }
}
async function GetMessagesModel (errorMessage, applicationRef) {
  const apps = await messageRepository.getAllMessagesByAppRef(applicationRef)
  const applicationstages = apps.map(item => {
    return ([
      {
        text: item.grant_type
      },
      {
        html: `${item.appref}`
      },
      {
        text: item.subject
      },
      {
        text: `${item.updated_at.toLocaleDateString('en-GB')} ${item.updated_at.toLocaleTimeString('en-GB')}`
      },
      {
        html: `<a href='/messages/${item.id}/view'>View</a>`
      }
    ]
    )
  })
  return {
    applicationmessages: applicationstages
  }
}
function getForestrySummary (forestryInfo) {
  if (forestryInfo && forestryInfo.forestry.length > 0) {
    const result = []
    forestryInfo.forestry.forEach(item => {
      result.push({
        key: {
          text: item
        },
        value: {
          text: ''
        }
      })
    })
    return result
  } else {
    return []
  }
}
async function getApplicationModel (ref, errorMessage) {
  const a = await get(ref)
  const appDetails = JSON.parse(a.data)
  const selectedEquipments = appDetails.selectedEquipments
  const docs = await sharepoint.listFiles(`SGS_POC/${ref}`)
  const noteDatas = await appNoteRepository.getAllByAppRef(ref)
  const stages = await createStageModel(null, ref)
  const messages = await GetMessagesModel(null, ref)
  let statusClass = ''
  switch (a.status) {
    case 'Pending':
      statusClass = 'govuk-tag--grey'
      break
    case 'New':
      statusClass = 'govuk-tag--blue'
      break
    case 'Rejected':
      statusClass = 'govuk-tag--red'
      break
  }
  let notes
  if (noteDatas) {
    notes = noteDatas.map(n => {
      return [
        { text: n.note },
        { text: n.created_at.toLocaleDateString('en-GB') },
        { text: n.created_by }
      ]
    })
  }
  const equipments = selectedEquipments.length <= 0
    ? null
    : selectedEquipments.map(item => {
      return [
        { text: item.id },
        { text: item.quantity },
        { text: item.grantAmount },
        { text: item.grantAmount * item.quantity }
      ]
    })
  let documents
  if (docs) {
    documents = docs.map(i => {
      return [
        {
          html: `<a href='${i['@microsoft.graph.downloadUrl']}'>${i.name}</a>`
        }]
    })
  }
  return {
    notes: notes,
    docs: documents,
    ref: a.reference,
    status: `<span class="govuk-tag ${statusClass}">${a.status}</span>`,
    farmerCRN: appDetails.crn,
    equipments: equipments,
    grandTotal: selectedEquipments.reduce((total, item) => {
      return total + parseInt(item.quantity) * parseFloat(item.grantAmount)
    }, 0),
    livestock: appDetails.liveStock,
    forestry: getForestrySummary(appDetails.forestry),
    agreement: appDetails.agreement,
    businessDetails: appDetails.businessDetails,
    farmerDetails: appDetails.farmerDetails.firstName + ' ' + appDetails.farmerDetails.lastName,
    farmerPostCode: appDetails.farmerDetails.postcode,
    farmerAddressDetails: `${appDetails.farmerDetails.address1}${(appDetails.farmerDetails.address2 ?? '').length > 0 ? '<br/>' : ''}${appDetails.farmerDetails.address2}<br/>${appDetails.farmerDetails.town}<br/>${appDetails.farmerDetails.county}<br/>${appDetails.farmerDetails.postcode}`,
    farmerContactDetails: `${appDetails.farmerDetails.email}${(appDetails.farmerDetails.landline ?? '').length > 0 ? '<br/>' : ''}${appDetails.farmerDetails.landline}<br/>${appDetails.farmerDetails.mobile}`,
    stages,
    messages
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: async (request, h) => {
      return h.view(viewTemplate, await createModel(request, null))
    }
  },
  {
    method: 'GET',
    path: `${currentPath}/{ref}`,
    handler: async (request, h) => {
      return h.view('application', await getApplicationModel(request.params.ref, null))
    }
  },
  {
    method: 'POST',
    path: `${currentPath}/search`,
    handler: (request, h) => {
      console.log(request.payload, 'payload')
      return h.view(viewTemplate, createModel(request, null))
    }
  },
  {
    method: 'POST',
    path: `${currentPath}/{ref}/note`,
    handler: async (request, h) => {
      console.log(request.payload, 'payload')
      await appNoteRepository.set({
        appref: request.params.ref,
        note: request.payload.note,
        created_by: request.auth.credentials.userName,
        updated_by: request.auth.credentials.userName,
        updated_at: new Date(),
        created_at: new Date()
      })
      return h.view('application', await getApplicationModel(request.params.ref, null))
    }
  },
  {
    method: 'POST',
    path: `${currentPath}/{ref}`,
    handler: async (request, h) => {
      const fileDetails = request.payload.file.hapi
      const contentBuffer = request.payload.file._data
      await sharepoint.uploadFile(contentBuffer, fileDetails.filename, `SGS_POC/${request.params.ref}/`)
      return h.view('application', await getApplicationModel(request.params.ref, null))
    },
    options: {
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        allow: 'multipart/form-data',
        maxBytes: 2 * 1000 * 1000
      }
    }
  },
  {
    method: 'POST',
    path: `${currentPath}/messages/{appref}/create`,
    handler: async (request, h) => {
      console.log(request.payload, 'payload')
      await messageRepository.set({
        subject: request.payload.subject,
        appref: request.params.appref,
        grant_type: 'SGS001',
        data: request.payload.data,
        created_by: request.auth.credentials.userName,
        updated_by: request.auth.credentials.userName,
        updated_at: new Date(),
        created_at: new Date()
      })
      return h.view('application', await getApplicationModel(request.params.appref, null))
    }
  }
]
