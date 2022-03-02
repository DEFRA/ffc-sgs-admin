module.exports = {
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return h.view('dashboard', { button: { nextLink: 'nextPath', text: 'Start now' } })
  }
}
