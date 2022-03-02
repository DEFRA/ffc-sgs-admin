const viewTemplate = 'businessprocesses'
const currentPath = `/${viewTemplate}`
const { getAll, get } = require('../repositories/businessprocess-repository')

async function createModel (request, errorMessage) {
  const apps = await getAll()
  const businessprocesses = apps.map(item => {
    return ([
      {
        text: item.grant_type
      },
      {
        html: `${item.name}`
      },
      {
        text: item.description
      },
      {
        text: item.businessprocess?.name
      },
      {
        text: item.created_by
      },
      {
        text: item.created_at.toLocaleDateString('en-GB')
      }
    ]
    )
  })
  console.log(businessprocesses, 'apps')
  return {
    businessprocesses: businessprocesses,
    formActionPage: currentPath,
    errorMessage
  }
}

async function getModel (id, errorMessage) {
  const a = await get(id)
  return JSON.parse(a.data)
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
    path: `${currentPath}/{id}`,
    handler: async (request, h) => {
      return h.view('application', await getModel(request.params.id, null))
    }
  },
  {
    method: 'POST',
    path: `${currentPath}/{id}`,
    handler: (request, h) => {
      console.log(request.payload, 'payload')
      return h.view(`${viewTemplate}/create`, createModel(request, null))
    }
  }
]
