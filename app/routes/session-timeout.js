module.exports = {
  method: 'GET',
  path: '/session-timeout',
  handler: function (request, h) {
    return h.view('session-timeout', { startLink: '/nature-of-business' })
  }
}
