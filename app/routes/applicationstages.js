const viewTemplate = 'applicationstages'
const currentPath = `/${viewTemplate}`
const { getAllByAppRef, get, getByUser, update } = require('../repositories/applicationstage-repository')
const { set } = require('../repositories/applicationstageresponse-repository')
const getStatusClass = (status) => {
  let statusClass = ''
  switch (status) {
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
  return statusClass
}
async function createModel (request, errorMessage, applicationRef) {
  const apps = await getAllByAppRef(applicationRef)
  const applicationstages = apps.map(item => {
    return ([
      {
        html: `<a href='/applications/${item.appref}'>${item.appref}</a>`
      },
      {
        html: `<a href='/applicationstages/${item.appref}/${item.stageid}'>${item.stage.name}</a>`
      },
      {
        text: item.created_at.toLocaleDateString('en-GB')
      },
      {
        html: item.stage.usergroups
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
async function getMyTaskModel (username, errorMessage) {
  const item = await getByUser(username)
  const applicationstageresponses = item.map(a => {
    const lnkHtml = a.status === 'Pending' || a.status === 'New' ? `<a href='/applicationstages/${a.appref}/${a.id}/response'>Approve/Reject</a>` : 'NA'
    return ([
      {
        html: a.appref
      },
      {
        text: a.stage.name
      },
      {
        text: a.stage.usergroups
      },
      {
        text: a.stage.businessprocess.name
      },
      {
        text: a.created_at.toLocaleDateString('en-GB')
      },
      {
        html: `<strong class="govuk-tag ${getStatusClass(a.status)}">${a.status}</strong>`
      },
      {
        html: lnkHtml
      }
    ]
    )
  })

  return { mytasks: applicationstageresponses }
}

async function getApplicationModel (id, ref, errorMessage) {
  const item = await get(id)
  const applicationstageresponses = item.applicationstageresponses.map(a => {
    return ([
      {
        html: item.stage.name
      },
      {
        html: a.remark
      },
      {
        text: a.activity
      },
      {
        text: a.created_at.toLocaleDateString('en-GB')
      },
      {
        html: `<strong class="govuk-tag ${getStatusClass(a.status)}">${a.status}</strong>`
      }
    ]
    )
  })
  const model =
     {
       id: item.id,
       stageid: item.stageid,
       stagename: item.stage.name,
       usergroups: item.stage.usergroups,
       businessprocessName: item.stage.businessprocess.name,
       created_at: item.stage.created_at,
       status: `<strong class="govuk-tag ${getStatusClass(item.status)}">${item.status}</strong>`,
       action: `<a href='/applicationstages/${item.appref}/${item.id}/response'>Approve/Reject</a>`,
       applicationstageresponses: applicationstageresponses
     }
  return {
    appref: ref,
    data: model,
    applicationstageresponses: applicationstageresponses
  }
}

async function createResponseModel (id, ref, request, errorMessages) {
  const a = await get(id)
  return {
    formActionPage: `${currentPath}/${ref}/${id}/response`,
    applicationstageid: a.id,
    remark: '',
    activity: '',
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'action',
      name: 'action',
      fieldset: {
        legend: {
          text: 'Actions',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m'
        }
      },
      items: [
        {
          value: 'Approved',
          text: 'Approve',
          checked: true
        },
        {
          value: 'Rejected',
          text: 'Reject',
          checked: false
        },
        {
          value: 'Assign',
          text: 'Assign',
          checked: false
        }
      ]
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: `${currentPath}/{ref}`,
    handler: async (request, h) => {
      return h.view(viewTemplate, await createModel(request, null, request.params.ref))
    }
  },
  {
    method: 'GET',
    path: `${currentPath}/{ref}/{id}`,
    handler: async (request, h) => {
      return h.view('stage', await getApplicationModel(request.params.id, request.params.ref, null))
    }
  },
  {
    method: 'GET',
    path: `${currentPath}/{ref}/{id}/response`,
    handler: async (request, h) => {
      return h.view('stageresponse', await createResponseModel(request.params.id, request.params.ref, request, null))
    }
  },
  {
    method: 'POST',
    path: `${currentPath}/{ref}/{id}/response`,
    handler: async (request, h) => {
      console.log(request.payload, 'payload')
      let status = request.payload.action
      let assignedTo = null
      if (status === 'Assign') {
        assignedTo = []
        assignedTo.push(request.payload.assignedTo)
        status = 'Pending'
      }
      await set({
        applicationstageid: request.params.id,
        remark: request.payload.remark,
        activity: request.payload.activity,
        created_by: request.auth.credentials.userName,
        updated_by: request.auth.credentials.userName,
        updated_at: new Date(),
        created_at: new Date(),
        status: request.payload.action
      })
      const item = await get(request.params.id)
      console.log(item.type, 'stage details')
      if ((item.type ?? 'Single') === 'Single') {
        await update({
          status: status,
          id: item.id,
          updated_by: request.auth.credentials.userName,
          updated_at: new Date(),
          assignedTo: assignedTo
        })
      }
      return h.redirect(`${currentPath}/${request.params.ref}/${request.params.id}`)
    }
  },
  {
    method: 'GET',
    path: '/mytasks',
    handler: async (request, h) => {
      const username = 'satish.chatap@capgemini.com'
      return h.view('mytasks', await getMyTaskModel(username, request))
    }
  }
]
