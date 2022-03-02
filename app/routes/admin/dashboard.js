module.exports = {
  method: 'GET',
  path: '/admin/',
  handler: (request, h) => {
    return h.view('dashboard', { button: { nextLink: 'nextPath', text: 'Start now' } })
  }
}
