const CURRENCY_FORMAT = /^(\d+|\d{1,3}(,\d{3})*)(\d+)?$/
const CHARS_MAX_10 = /^.{1,10}$/
const CHARS_MIN_10 = /^.{10,}$/
const CHARS_MAX_100 = /^.{0,100}$/
const WORDS_MAX_60 = /^(?:\b\w+\b[\s.',-]*){1,60}$/
const WHOLE_NUMBER_REGEX = /^[1-9]\d*/
const NUMBER_REGEX = /^\d+$/
const SBI_REGEX = /^(\d{0}|\d{9})$/
const SELECT_VARIABLE_TO_REPLACE = /{{_(.+?)_}}/ig
const DELETE_POSTCODE_CHARS_REGEX = /[)(.\s-]*/g
const POSTCODE_REGEX = /^[\s]*[a-z]{1,2}\d[a-z\d]?[\s]*\d[a-z]{2}[\s]*$/i
const NAME_ONLY_REGEX = /^[a-zA-Z,' -]*$/
const PHONE_REGEX = /^\+?[0-9\[\s\(\)\]\-]{10,}$/
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/

module.exports = {
  CURRENCY_FORMAT,
  CHARS_MAX_10,
  CHARS_MIN_10,
  CHARS_MAX_100,
  WORDS_MAX_60,
  SELECT_VARIABLE_TO_REPLACE,
  DELETE_POSTCODE_CHARS_REGEX,
  POSTCODE_REGEX,
  WHOLE_NUMBER_REGEX,
  SBI_REGEX,
  NUMBER_REGEX,
  NAME_ONLY_REGEX,
  PHONE_REGEX,
  EMAIL_REGEX
}
