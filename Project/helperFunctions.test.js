describe ('distanceBetweenTwoPoints', function() {
  // var index = require('./index.js')
  // const server = require('./Backend/server.js')
  const env = require('dotenv')
  env.config()
  const helperFunctions = require('./helperFunctions.js')

  // beforeEach(async function() {
  //   await index.start()
  // })
  //
  // afterEach(async function() {
  //   await server.disconnect()
  // })

  it('should exist', function() {
    expect(helperFunctions.distanceBetweenTwoPoints).toBeDefined()
  })

  it('should be accurate', async function() {
    const distance = await helperFunctions.distanceBetweenTwoPoints("700 Bolinwood Dr Chapel Hill NC 27514", "61 38th Ave NW Hickory NC")
    expect(distance).toBe("2")
  })

})
