const viewTemplate = 'grants'
const currentPath = `/${viewTemplate}`
const { getAll, get } = require('../repositories/grant-repository')
const previousPath = '/admin'

async function createModel (request, errorMessage) {
  const apps = await getAll()
  const grants = apps.map(item => {
    console.log(item)
    return ([
      {
        text: item.key ?? ''
      },
      {
        text: item.grant_type
      },
      {
        html: `<a href='/grants/${item.key}'>${item.name}</a>`
      },
      {
        text: item.description
      },
      {
        text: `£ ${item.mingrantamount}`,
        format: 'numeric',
        attributes: {
          'data-sort-value': item.mingrantamount
        }
      },
      {
        text: `£ ${item.maxgrantamount}`,
        format: 'numeric',
        attributes: {
          'data-sort-value': item.maxgrantamount
        }
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
  
  return {
    grants: grants,
    formActionPage: currentPath,
    errorMessage
  }
}

async function getModel (grantDetails, errorList) {
  const {
    key,
    name,
    description,
    mingrantamount,
    maxgrantamount
  } = grantDetails

  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...errorList ? { errorList } : {},

    inputkey: {
      id: 'key',
      name: 'key',
      classes: '',
      label: {
        text: 'Key',
        classes: 'govuk-label'
      },
      hint: {
        text: 'For example, SGS001'
      },
      ...(key ? { value: key } : {}),
      ...(errorList && errorList.some(err => err.href === '#inputkey') ? { errorMessage: { text: errorList.find(err => err.href === '#inputkey').text } } : {})
    },
    inputname: {
      id: 'name',
      name: 'name',
      classes: '',
      label: {
        text: 'Grant name',
        classes: 'govuk-label'
      },
      hint: {
        text: 'Name of the grant scheme.'
      },
      ...(name ? { value: name } : {}),
      ...(errorList && errorList.some(err => err.href === '#businessType') ? { errorMessage: { text: errorList.find(err => err.href === '#businessType').text } } : {})
    },
    inputdescription: {
      id: 'description',
      name: 'Description',
      classes: 'govuk-input--width-10',
      label: {
        text: 'Description',
        classes: 'govuk-label'
      },
      hint: {
        text: 'Description of grant scheme'
      },
      ...(description ? { value: description } : {}),
      ...(errorList && errorList.some(err => err.href === '#description') ? { errorMessage: { text: errorList.find(err => err.href === '#description').text } } : {})
    },
    inputmaxgrantamount: {
      id: 'maxgrantamount',
      name: 'maxgrantamount',
      classes: 'govuk-input--width-10',
      prefix: {
        text: '£'
      },
      label: {
        text: 'Max grant amount (£)',
        classes: 'govuk-label'
      },
      ...(maxgrantamount ? { value: maxgrantamount } : {}),
      ...(errorList && errorList.some(err => err.href === '#maxgrantamount') ? { errorMessage: { text: errorList.find(err => err.href === '#maxgrantamount').text } } : {})
    },
    inputmingrantamount: {
      id: 'mingrantamount',
      name: 'mingrantamount',
      classes: 'govuk-input--width-10',
      prefix: {
        text: '£'
      },
      label: {
        text: 'Min grant amount (£)',
        classes: 'govuk-label'
      },
      ...(mingrantamount ? { value: mingrantamount } : {}),
      ...(errorList && errorList.some(err => err.href === '#mingrantamount') ? { errorMessage: { text: errorList.find(err => err.href === '#mingrantamount').text } } : {})
    }
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
    path: `${currentPath}/{id}`,
    handler: async (request, h) => {
      const a = await get(request.params.id)
      console.log(a, 'entity')
      return h.view(`${viewTemplate}/create`, await getModel(a, null))
    }
  },
  {
    method: 'GET',
    path: `${currentPath}/create`,
    handler: async (request, h) => {
      return h.view(`${viewTemplate}/create`, await getModel({}, null))
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
