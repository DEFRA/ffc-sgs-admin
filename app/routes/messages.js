const viewTemplate = 'messages'
const currentPath = `/${viewTemplate}`
const { getAll, get, set } = require('../repositories/message-repository')

async function createModel (request, errorMessage) {
  const apps = await getAll()
  const messages = apps.map(item => {
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
        text: item.created_at.toLocaleDateString('en-GB')
      },
      {
        html: `<a href='/messages/${item.id}/view'>View</a>`
      }
    ]
    )
  })
  return {
    messages: messages,
    formActionPage: currentPath,
    errorMessage
  }
}

async function getModel (id, errorMessage) {
  const a = await get(id)
  console.log(a, 'message')
  return a
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
    path: `${currentPath}/{appref}/messages`,
    handler: async (request, h) => {
      return h.view(viewTemplate, await createModel(request, null))
    }
  },
  {
    method: 'GET',
    path: `${currentPath}/{id}/view`,
    handler: async (request, h) => {
      const a = await get(request.params.id)
      console.log(a, 'entity')
      const message = [
        {
          key: {
            text: 'Subject'
          },
          value: {
            text: a.dataValues.subject
          }
        },
        {
          key: {
            text: 'Message'
          },
          value: {
            text: a.dataValues.data
          }
        },
        {
          key: {
            text: 'App Ref'
          },
          value: {
            text: a.dataValues.appref
          }
        },
        {
          key: {
            text: 'Sent On'
          },
          value: {
            text: `${a.dataValues.created_at.toLocaleDateString('en-GB')} ${a.dataValues.created_at.toLocaleTimeString('en-GB')}`
          }
        }
      ]
      return h.view(`${viewTemplate}/view`, { messages: message, backLink: `/applications/${a.dataValues.appref}#messages` })
    }
  },
  {
    method: 'Get',
    path: `${currentPath}/create`,
    handler: (request, h) => {
      console.log(request.payload, 'payload')
      return h.view(`${viewTemplate}/create`, createModel(request, null))
    }
  },
  {
    method: 'POST',
    path: `${currentPath}/create`,
    handler: async (request, h) => {
      console.log(request.payload, 'payload')
      await set({
        subject: request.payload.subject,
        appref: 'SGS001-79B-6EB',
        grant_type: 'SGS001',
        data: request.payload.data,
        created_by: request.auth.credentials.userName,
        updated_by: request.auth.credentials.userName,
        updated_at: new Date(),
        created_at: new Date()
      })
      return h.view(`${viewTemplate}/create`, createModel(request, null))
    }
  }
]
