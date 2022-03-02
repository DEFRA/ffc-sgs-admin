describe('Error Page', () => {
  test('should return 404', async () => {
    const options = {
      method: 'GET',
      url: '/adding-value/somethingnotavailable'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(404)
    expect(response.payload).toContain('Page not found')
  })
})
