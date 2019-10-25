const	env = require('dotenv')
env.config()
const database = require('../Backend/database.js')

describe ('getAllAmenities', function() {
  it('should be a function', function() {
    expect(typeof database.getAllAmenities).toBe("function")
  })

  it('should be accurate', async function() {
    const amenities = await database.getAllAmenities()
    expect(amenities).toBeDefined()
    expect(amenities.length).toBe(11)
    expect(amenities[0].name).toBe("Dryer")
  })
})
