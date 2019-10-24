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

  it('should be accurate', async function() {
    const amenities = await database.getAllAmenities()
    console.log(amenities);
    expect(amenities).toBeDefined()
    expect(amenities.length).toBe(11)
    expect(amenities[0].name).toBe("Dryer")
  })
})
