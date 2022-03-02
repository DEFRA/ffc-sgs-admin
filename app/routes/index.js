const { questionBank } = require('../config/question-bank')
const { getHandler, getPostHandler } = require('../helpers/handlers')

const drawSectionGetRequests = (section) => {
  return section.questions.map(question => {
    return {
      method: 'GET',
      path: `/${question.url}`,
      handler: getHandler(question)
    }
  })
}

const drawSectionPostRequests = (section) => {
  return section.questions.map((question) => {
    return {
      method: 'POST',
      path: `/${question.url}`,
      handler: getPostHandler(question)
    }
  })
}

let pages = questionBank.sections.map(section => drawSectionGetRequests(section))
pages = [...pages, ...questionBank.sections.map(section => drawSectionPostRequests(section))]
pages.push(require('./score'))
module.exports = pages
