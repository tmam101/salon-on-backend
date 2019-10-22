describe ('getAllAmenities', function() {
  const database = require('./database.js')
  // dotenv is supposed to configure my .env file, but it isn't working.
  const		env 			= require('dotenv')
  env.config()
  
  it('should exist', function() {
    expect(database.getAllAmenities).toBeDefined()
  })

  it('should be a function', function() {
    expect(typeof database.getAllAmenities).toBe("function")
  })

  it('should return json', async function() {
    const result = await database.getAllAmenities()
    console.log(result);
    expect(result).toBeDefined()
  })
})
