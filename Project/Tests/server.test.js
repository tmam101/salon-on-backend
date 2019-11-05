const server = require('../Backend/server.js')

describe('startServer', function() {
  it('should be accurate', async function() {
    const port = await server.startServer()
    expect(port).toBeDefined()
    // TODO Handle errors
  })
})
