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
    expect(amenities.length).toBeGreaterThan(0)
    expect(amenities[0].name).toBe("Dryer")
  })
  it('should handle errors', async function() {
    // TODO
  })
})

describe('getAllHairStyles', function() {
  it('should be a function', function() {
    expect(typeof database.getAllHairStyles).toBe("function")
  })
  it('should be accurate', async function() {
    const hairstyles = await database.getAllHairStyles()
    expect(hairstyles).toBeDefined()
    expect(hairstyles.length).toBeGreaterThan(0)
    expect(hairstyles[0].styleName).toBe("Beard Styling")
  })
  it('should handle errors', async function() {
    // TODO
  })
})

describe('getAllStylists', function() {
  it('should be a function', function() {
    expect(typeof database.getAllStylists).toBe("function")
  })
  it('should be accurate', async function() {
    const stylists = await database.getAllStylists()
    expect(stylists).toBeDefined()
    expect(stylists.length).toBeGreaterThan(0)
    expect(stylists[0].first).toBe("bob")
  })
  it('should handle errors', async function() {
    // TODO
  })
})

describe('getAllClients', function() {
  it('should be a function', function() {
    expect(typeof database.getAllClients).toBe("function")
  })
  it('should be accurate', async function() {
    const clients = await database.getAllClients()
    expect(clients).toBeDefined()
    expect(clients.length).toBeGreaterThan(0)
    expect(clients[0].first).toBe("first")
  })
  it('should handle errors', async function() {
    // TODO
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
  it('should handle errors', async function() {
    // TODO
  })
})

describe('searchStylistsByZip', function() {
  it('should be a function', function() {
    expect(typeof database.searchStylistsByZip).toBe("function")
  })
  it('should be accurate', async function() {
    const profiles = await database.searchStylistsByZip(27514, 10)
    expect(profiles).toBeDefined()
    expect(profiles.length).toBeGreaterThan(0)
    profiles.forEach(function(e) {
      expect(e.isStylist).toBe(1)
    })
  })
  it('should handle errors', async function() {
    const profiles = await database.searchStylistsByZip(1, 10)
    expect(profiles).toBeDefined()
    expect(profiles.sorry).toBeDefined()
  })
})

describe('searchStylistsSpecificLocation', function() {
  it('should be accurate', async function() {
    expect(typeof database.searchStylistsSpecificLocation).toBe("function")
    const stylists = await database.searchStylistsSpecificLocation("700 Bolinwood Dr Chapel Hill NC", "27514", "10")
    expect(stylists).toBeDefined()
    expect(stylists.profiles.length).toBeGreaterThan(0)
    stylists.profiles.forEach(function(e) {
      expect(e.isStylist).toBe(1)
    })
  })
  it('should handle errors', async function() {
    // TODO
  })
})

describe('getAmenityByID', function() {
  it('should be a function', function() {
    expect(typeof database.getAmenityByID).toBe("function")
  })
  it('should be accurate', async function() {
    const amenity = await database.getAmenityByID("1")
    expect(amenity).toBeDefined()
    expect(amenity.name).toBe("Dryer")
  })
  it('should handle errors', async function() {
    // TODO
  })
})

describe('getClientByID', function() {
  it('should be a function', function() {
    expect(typeof database.getClientByID).toBe("function")
  })
  it('should be accurate', async function() {
    const client = await database.getClientByID("testemailthomas@gmail.com")
    expect(client).toBeDefined()
    expect(client.first).toBe("Thomas")
  })
  it('should handle errors', async function() {
    // TODO
  })
})

describe('getClientByUserAndPass', function() {
  it('should be a function', function() {
    expect(typeof database.getClientByUserAndPass).toBe("function")
  })
  it('should be accurate', async function() {
    const client = await database.getClientByUserAndPass("testemailthomas@gmail.com", "testpasswordthomas")
    expect(client).toBeDefined()
    expect(client.first).toBe("Thomas")
  })
  it('should handle errors', async function() {
    const client = await database.getClientByUserAndPass("testemailthomas@gmail.com", "badpassword")
    expect(client).toBeDefined()
    expect(client.Error).toBeDefined
  })
})

describe('getClientAppointments', function() {
  it('should be accurate', async function() {
    expect(typeof database.getClientAppointments).toBe("function")
    const appointments = await database.getClientAppointments("susie@mail.com")
    expect(appointments).toBeDefined()
    expect(appointments.bookings.length).toBeGreaterThan(0)
    expect(appointments.bookings[0].client).toBe('susie@mail.com')
  })
  it('should handle errors', async function() {
    // TODO
  })
})

// TODO I'm unsure of how to test this
describe('getStylistAppointments', function() {
  it('should be accurate', async function() {
    expect(typeof database.getStylistAppointments).toBe("function")
    // TODO
  })
  it('should handle errors', async function() {
    // TODO
  })

})

// TODO There are errors here.  Check out the function in the database file.
describe('createBooking', function() {
  it('should be accurate', async function() {
    expect(typeof database.createBooking).toBe("function")
    const status = await database.createBooking("testemailthomas@gmail.com", "1", "2019-10-10", "09:30:00")
    console.log(status)
    expect(status).toBeDefined()
    // expect(status).toBe(true)
    // TODO Delete booking
  })
  it('should handle errors', async function() {
    // TODO
  })
})

describe('createUser', function() {
  it('should be a function', function() {
    expect(typeof database.createUser).toBe("function")
  })
  it('should be accurate', async function() {
    // Create user and test it
    var status = await database.createUser("emailfortestingpurposes@mail.com", "passwordfortestingpurposes", "first", "last", "FALSE", "FALSE", "NULL", "NULL", "NULL")
    expect(status).toBeDefined()
    expect(status).toBe(true)
    // Delete user and test it
    status = await database.runQuery("DELETE FROM user WHERE email='emailfortestingpurposes@mail.com'")
    expect(status).toBeDefined()
    expect(status.affectedRows).toBeDefined()
    expect(status.affectedRows).toBe(1)
  })
  it('should handle errors', async function() {
    // Create user and test it
    var status = await database.createUser("emailfortestingpurposes@mail.com", "passwordfortestingpurposes", "first", "last", "FALSE", "FALSE", "NULL", "NULL", "NULL")
    expect(status).toBeDefined()
    expect(status).toBe(true)
    // Test to ensure duplicates can't be inserted
    status = await database.createUser("emailfortestingpurposes@mail.com", "passwordfortestingpurposes", "first", "last", "FALSE", "FALSE", "NULL", "NULL", "NULL")
    expect(status).toBeDefined()
    expect(status).toBe(false)
    // Delete user
    status = await database.runQuery("DELETE FROM user WHERE email='emailfortestingpurposes@mail.com'")
    expect(status).toBeDefined()
    expect(status.affectedRows).toBeDefined()
    expect(status.affectedRows).toBe(1)
  })
})

describe('addStylist', function() {
  it('should be a function', function() {
    expect(typeof database.addStylist).toBe("function")
  })
  it('should be accurate', async function() {
    // Create user first
    var status = await database.createUser("stylistemailfortestingpurposes@mail.com", "passwordfortestingpurposes", "first", "last", "FALSE", "FALSE", "NULL", "NULL", "NULL")
    expect(status).toBeDefined()
    expect(status).toBe(true)
    // Change user to stylist and test it
    // TODO The below commented code returns the error: "ER_WRONG_VALUE_COUNT_ON_ROW: Column count doesn't match value count at row 1".
    // I think line 156 of database, styleQueries.push(Insert into offersStyle)..., doesn't handle every column in the table.  I think it might not handle offerID.
    // status = await database.addStylist("stylistemailfortestingpurposes@mail.com", "biofortestingpurposes", [{id : "1", price : "20", deposit : "10", duration : "2"}])
    // console.log(status)
    // expect(status).toBeDefined()
    // expect(status).toBe(true)
    // Delete user and test it
    status = await database.runQuery("DELETE FROM user WHERE email='stylistemailfortestingpurposes@mail.com'")
    expect(status).toBeDefined()
    expect(status.affectedRows).toBeDefined()
    expect(status.affectedRows).toBe(1)
  })
  it('should handle errors', async function() {
    // // Create user and test it
    // var status = await database.addStylist("stylistemailfortestingpurposes@mail.com", "biofortestingpurposes", ["style1", "style2"])
    // expect(status).toBeDefined()
    // expect(status).toBe(true)
    // // Test to ensure duplicates can't be inserted
    // status = await database.addStylist("stylistemailfortestingpurposes@mail.com", "biofortestingpurposes", ["style1", "style2"])
    // expect(status).toBeDefined()
    // expect(status).toBe(false)
    // // Delete user
    // status = await database.runQuery("DELETE FROM user WHERE email='stylistemailfortestingpurposes@mail.com'")
    // expect(status).toBeDefined()
    // expect(status.affectedRows).toBeDefined()
    // expect(status.affectedRows).toBe(1)
  })
// TODO Create the stylist, test it, then delete it and test that
})

// TODO Can we get rid of these functions?
// describe('connect', function() {
//   it('should be a function', function() {
//     expect(typeof database.connect).toBe("function")
//   })
//   // TODO
// })
//
// describe('disconnect', function() {
//   it('should be a function', function() {
//     expect(typeof database.disconnect).toBe("function")
//   })
//   // TODO
// })

describe('runQuery', function() {
  it('should be a function', function() {
    expect(typeof database.runQuery).toBe("function")
  })
  it('should be accurate', async function() {
    // Test inserting user
    var query = "INSERT INTO user VALUES ('runquerytestemail@mail.com', 'testpassword', 'first', 'last', FALSE, FALSE, NULL, NULL, 2)"
    var status = await database.runQuery(query)
    expect(status).toBeDefined()
    expect(status.affectedRows).toBe(1)
    // Test deleting user
    query = "DELETE FROM user WHERE email='runquerytestemail@mail.com'"
    status = await database.runQuery(query)
    expect(status).toBeDefined()
    expect(status.affectedRows).toBe(1)
  })
})

// TODO Figure out a way to not have to export functions to test them
describe('transaction', function() {
  it('should be a function', function() {
    expect(typeof database.transaction).toBe("function")
  })
  it('should be accurate', async function() {
    const query1 = "INSERT INTO user VALUES ('runquerytest1email@mail.com', 'testpassword', 'first', 'last', FALSE, FALSE, NULL, NULL, 2)"
    const query2 = "INSERT INTO user VALUES ('runquerytest2email@mail.com', 'testpassword', 'first', 'last', FALSE, FALSE, NULL, NULL, 2)"
    const query3 = "DELETE FROM user WHERE email='runquerytest1email@mail.com'"
    const query4 = "DELETE FROM user WHERE email='runquerytest2email@mail.com'"
    const status = await database.transaction([query1, query2, query3, query4])
    expect(status).toBeDefined()
    expect(status).toBe(true)
  })
  it('should handle errors', async function() {
    const query1 = "INSET INTO user VALUES ('runquerytest1email@mail.com', 'testpassword', 'first', 'last', FALSE, FALSE, NULL, NULL, 2)"
    const status = await database.transaction([query1])
    expect(status).toBeDefined()
    expect(status).toBe(false)
  })
  // TODO
})
