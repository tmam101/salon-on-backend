describe ('getAllAmenities', function() {
  const	env = require('dotenv')
  env.config()
  const database = require('./database.js')

  it('should exist', async function() {
    const amenities = await database.getAllAmenities()
    expect(amenities).toBeDefined()
  })

  it('should be a function', function() {
    expect(typeof database.getAllAmenities).toBe("function")
  })

  it('should return json', async function() {
    const amenities = await database.getAllAmenities()
    console.log(amenities);
    expect(amenities).toBeDefined()
  })
})
