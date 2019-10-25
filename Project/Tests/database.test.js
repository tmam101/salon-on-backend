const	env = require('dotenv')
env.config()
const database = require('../Backend/database.js')

describe('getAllAmenities', function() {
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
    expect(hairstyles.length).toBe(49)
    expect(hairstyles[0].name).toBe("Beard Styling")
  })
})

describe('getAllStylists', function() {
  it('should be a function', function() {
    expect(typeof database.getAllStylists).toBe("function")
  })
  it('should be accurate', async function() {
    const stylists = await database.getAllStylists()
    expect(stylists).toBeDefined()
    expect(stylists.length).toBe(6)
    expect(stylists[0].first).toBe("bob")
  })
})

describe('getAllClients', function() {
  it('should be a function', function() {
    expect(typeof database.getAllClients).toBe("function")
  })
  it('should be accurate', async function() {
    const clients = await database.getAllClients()
    expect(clients).toBeDefined()
    expect(clients.length).toBe(18)
    expect(clients[0].first).toBe("first")
  })
})

describe('searchStylists', function() {
  it('should be a function', function() {
    expect(typeof database.searchStylists).toBe("function")
  })
  it('should be accurate', async function() {
    const stylists = await database.searchStylists("bob")
    expect(stylists).toBeDefined()
    expect(JSON.parse(stylists).length).toBeGreaterThan(0)
    expect(JSON.parse(stylists)[0].first).toBe("bob")
  })
})

describe('searchByLocation', function() {
  it('should be a function', function() {
    expect(typeof database.searchByLocation).toBe("function")
  })
  it('should be accurate', async function() {
    const profiles = await database.searchByLocation(27514, 10)
    expect(profiles).toBeDefined()
    expect(profiles.profiles.length).toBeGreaterThan(0)
  })
})

describe('getAmenityByID', function() {
  it('should be a function', function() {
    expect(typeof database.getAmenityByID).toBe("function")
  })
  it('should be accurate', async function() {
    const amenity = await database.getAmenityByID("0")
    expect(amenity).toBeDefined()
    expect(JSON.parse(amenity)[0].first).toBe("Dryer")
  })
})

describe('getClientByID', function() {
  it('should be a function', function() {
    expect(typeof database.getClientByID).toBe("function")
  })
  it('should be accurate', async function() {
    const client = await database.getClientByID("testemailthomas@gmail.com")
    console.log(client)
    expect(client).toBeDefined()
    expect(JSON.parse(client)[0].first).toBe("Thomas")
  })
})

describe('getClientByUserAndPass', function() {
  it('should be a function', function() {
    expect(typeof database.getClientByUserAndPass).toBe("function")
  })
  it('should be accurate', async function() {
    const client = await database.getClientByUserAndPass("testemailthomas@gmail.com", "testpasswordthomas")
    console.log(client)
    expect(client).toBeDefined()
    expect(JSON.parse(client).first).toBe("Thomas")
  })
})
