describe ('distanceBetweenTwoPoints', function() {
  // Configures env file for local testing
  const env = require('dotenv')
  env.config()

  const helperFunctions = require('../helperFunctions.js')

  it('should exist', function() {
    expect(helperFunctions.distanceBetweenTwoPoints).toBeDefined()
  })

  it('should be accurate', async function() {
    const distance = await helperFunctions.distanceBetweenTwoPoints("700 Bolinwood Dr Chapel Hill NC 27514", "61 38th Ave NW Hickory NC")
    expect(distance).toBe(237682)
  })

})
