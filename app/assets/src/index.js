import { initAll } from 'govuk-frontend'
import './application.scss'
import './scripts/cookies'
import { accessibility } from './scripts/accessibility'
import { validation } from './scripts/validation'
import $ from 'jquery'
import moj from '@ministryofjustice/frontend'
import TimeoutWarning from '../../templates/components/timeout-warning/timeout-warning'
export function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (let i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes)
  }
}
window.addEventListener('load', (event) => {
  accessibility()
  validation()
})
initAll()

window.$ = $
moj.initAll()
const $timeoutWarnings = document.querySelectorAll('[data-module="govuk-timeout-warning"]')
nodeListForEach($timeoutWarnings, function ($timeoutWarning) {
  new TimeoutWarning($timeoutWarning).init()
})
