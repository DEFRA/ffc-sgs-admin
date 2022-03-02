const { getModel } = require('../helpers/models')
const { getHtml } = require('../helpers/conditionalHTML')
const { getYarValue } = require('../helpers/session')

const validateAnswerField = (value, validationType, details, payload) => {
  switch (validationType) {
    case 'NOT_EMPTY': {
      return (!!value)
    }

    case 'NOT_EMPTY_EXTRA': {
      if (value) {
        return true
      }

      const { extraFieldsToCheck } = details
      return extraFieldsToCheck.some(extraField => (
        !!payload[extraField]
      ))
    }

    case 'REGEX': {
      const { regex } = details
      return (!value || regex.test(value))
    }

    case 'MIN_MAX_CHARS': {
      const { min, max } = details
      return (value.length >= min && value.length <= max)
    }

    case 'MIN_MAX': {
      const { min, max } = details
      return (value >= min && value <= max)
    }

    case 'MAX_SELECT': {
      const { max } = details
      return ([value].flat().length <= max)
    }
    default:
      return false
  }
}

const checkInputError = (validate, isconditionalAnswer, payload, yarKey) => {
  return validate.find(
    ({ type, dependentKey, ...details }) => (isconditionalAnswer && dependentKey)
      ? (validateAnswerField(payload[dependentKey], type, details, payload) === false)
      : !dependentKey && (validateAnswerField(payload[yarKey], type, details, payload) === false)
  )
}

const customiseErrorText = (value, currentQuestion, errorList, h, request) => {
  const { yarKey, type, conditionalKey, conditionalLabelData } = currentQuestion
  let conditionalHtml

  if (conditionalKey) {
    const conditionalFieldError = errorList.find(thisErrorHref => thisErrorHref.href.includes(conditionalKey))?.text
    const conditionalFieldValue = (type === 'multi-input') ? getYarValue(request, yarKey)[conditionalKey] : getYarValue(request, conditionalKey)
    conditionalHtml = getHtml(conditionalKey, conditionalLabelData, conditionalFieldValue, conditionalFieldError)
  }
  const baseModel = getModel(value, currentQuestion, request, conditionalHtml)

  if (type === 'multi-input') {
    const baseModelItems = baseModel.items.map(thisItem => {
      const matchingErrorHref = errorList.find(thisErrorHref => thisErrorHref.href.includes(thisItem.id))

      if (matchingErrorHref) {
        return {
          ...thisItem,
          errorMessage: { text: matchingErrorHref.text }
        }
      }
      return thisItem
    })
    baseModel.items = [
      ...baseModelItems
    ]
  } else {
    baseModel.items = {
      ...baseModel.items,
      ...(errorList[0].href.includes(yarKey) ? { errorMessage: { text: errorList[0].text } } : {})
    }
  }
  const modelWithErrors = {
    ...baseModel,
    errorList
  }
  return h.view('page', modelWithErrors)
}

const checkErrors = (payload, currentQuestion, h, request) => {
  const { yarKey, answers, validate } = currentQuestion
  const conditionalAnswer = answers?.find(answer => answer.conditional)
  const errorHrefList = []
  let isconditionalAnswer
  let placeholderInputError
  if (currentQuestion.type === 'multi-input') {
    const { allFields } = currentQuestion

    allFields.forEach(
      ({ yarKey: inputYarKey, validate: inputValidate, answers: inputAnswers }) => {
        isconditionalAnswer = inputAnswers?.find(answer => answer.conditional)?.value === payload[inputYarKey]

        if (inputValidate) {
          placeholderInputError = checkInputError(inputValidate, isconditionalAnswer, payload, inputYarKey)

          if (placeholderInputError) {
            errorHrefList.push({
              text: placeholderInputError.error,
              href: `#${placeholderInputError.dependentKey ?? inputYarKey}`
            })
          }
        }
      }
    )

    if (errorHrefList.length > 0) {
      return customiseErrorText(payload, currentQuestion, errorHrefList, h, request)
    }
  }
  if (Object.keys(payload).length === 0 && currentQuestion.type) {
    placeholderInputError = validate.find(
      ({ type, dependentKey, ...details }) => (validateAnswerField(payload[yarKey], type, details, payload) === false))

    errorHrefList.push({
      text: placeholderInputError.error,
      href: `#${placeholderInputError.dependentKey ?? yarKey}`
    })
    return customiseErrorText('', currentQuestion, errorHrefList, h, request)
  }

  const payloadValue = typeof payload[yarKey] === 'string' ? payload[yarKey].trim() : payload[yarKey]
  isconditionalAnswer = payload[yarKey]?.includes(conditionalAnswer?.value)
  if (validate) {
    placeholderInputError = checkInputError(validate, isconditionalAnswer, payload, yarKey)

    if (placeholderInputError) {
      errorHrefList.push({
        text: placeholderInputError.error,
        href: `#${placeholderInputError.dependentKey ?? yarKey}`
      })
    }
  }

  if (errorHrefList.length > 0) {
    return customiseErrorText(payloadValue, currentQuestion, errorHrefList, h, request)
  }
}

module.exports = {
  customiseErrorText,
  checkErrors
}
