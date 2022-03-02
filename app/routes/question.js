
const questionBank = require('../config/equipmentGrant.json')
const { getModel } = require('../helpers/models')
const { getYarValue } = require('../helpers/session')

const { getPage, showPostPage } = require('../helpers/handlers')

const getData = (request, question) => {
  const { type, yarKey } = question
  let data = getYarValue(request, yarKey) || null
  if (type === 'multi-answer' && !!data) {
    data = [data].flat()
  }
  return data
}

const getGetPage = (question, request, h) => {
  const PAGE_MODEL = getModel(getData(request, question), question, request, '')
  return h.view('page', PAGE_MODEL)
}

const getQuestion = (questionKey) => {
  return questionBank.grants.filter(g => g.key === 'SGS001')[0]
    .sections.filter(s => s.key === 'eligibility')[0]
    .questions.filter(q => q.key === questionKey)
}

module.exports = [
  {
    method: 'GET',
    path: '/questions/{questionKey}',
    handler: (request, h) => {
      const question = getQuestion(encodeURIComponent(request.params.questionKey))
      return getPage(question[0], request, h)
    }
  },
  {
    method: 'POST',
    path: '/questions/{questionKey}',
    handler: (request, h) => {
      const question = getQuestion(encodeURIComponent(request.params.questionKey))
      return showPostPage(question[0], request, h)
    }
  }
]
