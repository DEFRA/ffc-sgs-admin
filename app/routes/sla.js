const viewTemplate = 'usergroups'
const currentPath = `/${viewTemplate}`
const { getAll, get } = require('../repositories/stage-repository')

async function createModel (request, errorMessage) {
  const apps = await getAll()
  const usergroups = apps.map(item => {
    return ([
      {
        text: item.grant_type
      },
      {
        html: `<a href='/usergroups/${item.id}'>${item.name}</a>`
      },
      {
        text: item.isstart,
        format: 'boolean'
      },
      {
        text: item.active,
        format: 'boolean'
      },
      {
        text: item.usergroups
      },
      {
        text: item.created_at.toLocaleDateString('en-GB')
      }
    ]
    )
  })
  console.log(usergroups, 'apps')
  return {
    usergroups: usergroups,
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
