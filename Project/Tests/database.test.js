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

describe('getAllHairStyles', function() {
  it('should be a function', function() {
    expect(typeof database.getAllHairStyles).toBe("function")
  })
  it('should be accurate', async function() {
    const hairstyles = await database.getAllHairStyles()
    expect(hairstyles).toBeDefined()
    expect(hairstyles.length).toBe(10)
    expect(hairstyles[0].name).toBe("Beard Styling")
  })
})

describe('getAllStylists', function() {
  it('should be a function', function() {
    expect(typeof database.getAllStylists).toBe("function")
  })
  it('should be accurate', async function() {
    const styles = await database.getAllStylists()
    console.log(styles)
    expect(styles).toBeDefined()
    expect(styles.length).toBe(10)
    expect(styles[0].name).toBe("Blow Out")
  })
})

describe('getAllClients', function() {
  it('should be a function', function() {
    expect(typeof database.getAllClients).toBe("function")
  })
  it('should be accurate', async function() {
    const clients = await database.getAllClients()
    console.log(clients)
    expect(clients).toBeDefined()
    expect(clients.length).toBe(10)
    expect(clients[0].name).toBe("Blow Out")
  })
})
