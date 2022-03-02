module.exports = {
  method: 'GET',
  path: '/account',
  handler: async (request, h) => {
    return h.view('account/details', request.auth.credentials)
  }
}
