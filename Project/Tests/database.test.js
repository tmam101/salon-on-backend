const	env = require('dotenv')
env.config()
const database = require('../Backend/database.js')


//RUN QUERY
describe('runQuery', function() {
  it('should be a function', function() {
    expect(typeof database.runQuery).toBe("function")
  })
  it('should be accurate', async function() {
    // Test inserting user
    var query = "INSERT INTO user VALUES ('jestRunQuery@mail.com', 'testpassword', 'first', 'last', FALSE, FALSE, NULL, NULL, 2)"
    var status = await database.runQuery(query)
    expect(status).toBeDefined()
    expect(status.affectedRows).toBe(1)
    // Test deleting user
    query = "DELETE FROM user WHERE email='jestRunQuery@mail.com'"
    status = await database.runQuery(query)
    expect(status).toBeDefined()
    expect(status.affectedRows).toBe(1)
  })
})


//GET ALL AMENITIES
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

//GET ALL HAIR STYLES
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

//CREATE USER
describe('createUser', function() {
  it('should be a function', function() {
    expect(typeof database.createUser).toBe("function")
  })
  it('should be accurate', async function() {
    // Create user and test it
    var status = await database.createUser("jestCreateUser@mail.com", "jestPassword", "jestFirst", "jestLast", false, false, "NULL", "NULL", "NULL")
    expect(status).toBeDefined()
    expect(status).toBe(true)
    // Delete user and test it
    status = await database.runQuery("DELETE FROM user WHERE email='jestCreateUser@mail.com'")
    expect(status).toBeDefined()
    expect(status.affectedRows).toBeDefined()
    expect(status.affectedRows).toBe(1)
  })
  it('should refuse duplicates', async function() {
    // Create user
     await database.createUser("jestCreateUser@mail.com", "passwordfortestingpurposes", "first", "last", "FALSE", "FALSE", "NULL", "NULL", "NULL")
    // Test to ensure duplicates can't be inserted
    let status = await database.createUser("jestCreateUser@mail.com", "passwordfortestingpurposes", "first", "last", "FALSE", "FALSE", "NULL", "NULL", "NULL")
    expect(status).toBeDefined()
    expect(status).toBe(false)
    // Delete user
    status = await database.runQuery("DELETE FROM user WHERE email='jestCreateUser@mail.com'")
    expect(status).toBeDefined()
    expect(status.affectedRows).toBeDefined()
    expect(status.affectedRows).toBe(1)
  })
})

//GET ALL STYLISTS
describe('getAllStylists', function() {
  it('should be a function', function() {
    expect(typeof database.getAllStylists).toBe("function")
  })
  it(' should return all stylists', async function() {
    const stylists = await database.getAllStylists()
    expect(stylists).toBeDefined()
    expect(stylists.length).toBeGreaterThan(0)
    expect(stylists[0].first).toBe("dylan")
  })
  it('should handle errors', async function() {
    // shouldn't have errors
  })
})

//GET ALL CLIENTS
describe('getAllClients', function() {
  it('should be a function', function() {
    expect(typeof database.getAllClients).toBe("function")
  })
  it('should be accurate', async function() {
    const clients = await database.getAllClients()
    expect(clients).toBeDefined()
    expect(clients.length).toBeGreaterThan(0)
  })
  it('should handle errors', async function() {
    // shouldn't have errors
  })
})

//SEARCH STYLIST BY NAME
describe('searchStylists', function() {
  it('should be a function', function() {
    expect(typeof database.searchStylists).toBe("function")
  })
  it('should be accurate', async function() {
    const stylists = await database.searchStylists("dylan")
    expect(stylists).toBeDefined()
    expect(JSON.parse(stylists).length).toBeGreaterThan(0)
    expect(JSON.parse(stylists)[0].first).toBe("dylan")
  })
  it('should handle errors', async function() {
    // shouldn't have errors
  })
})

//LOCATION STYLIST BY ZIP
describe('searchStylistsByZip', function() {
  it('should be a function', function() {
    expect(typeof database.searchStylistsByZip).toBe("function")
  })
  it('should be accurate', async function() {
    const profiles = await database.searchStylistsByZip(27949, 10)
    expect(profiles).toBeDefined()
    expect(profiles.length).toBeGreaterThan(0)
    profiles.forEach(function(e) {
      expect(e.isStylist).toBe(1)
    })
  })
  it('should handle errors', async function() {
    const profiles = await database.searchStylistsByZip(1, 10)
    expect(profiles).toBeDefined()
    expect(profiles.error).toBeDefined()
  })
})

//LOCATION STYLISTS SPECIFIC
describe('searchStylistsSpecificLocation', function() {
  it('should be accurate', async function() {
    expect(typeof database.searchStylistsSpecificLocation).toBe("function")
    const stylists = await database.searchStylistsSpecificLocation("106 Shadowood Dr Chapel Hill NC", "27514", "10")
    expect(stylists).toBeDefined()
    expect(stylists.profiles.length).toBeGreaterThan(0)
    stylists.profiles.forEach(function(e) {
      expect(e.isStylist).toBe(1)
    })
  })
  it('should handle errors', async function() {
    // shouldn't have errors (I don't think, worst case is no results)
  })
})

//GET AMINITY BY ID
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

//GET CLIENT BY ID
describe('getClientByID', function() {
  it('should be a function', function() {
    expect(typeof database.getClientByID).toBe("function")
  })
  it('should be accurate', async function() {
    const client = await database.getClientByID("dylan@mail.com")
    expect(client).toBeDefined()
    expect(client.first).toBe("dylan")
  })
  it('should handle errors', async function() {
    // TODO
  })
})

//LOGIN
describe('getClientByUserAndPass', function() {
  it('should be a function', function() {
    expect(typeof database.getClientByUserAndPass).toBe("function")
  })
  it('should be accurate', async function() {
    await database.createUser("jest@mail.com", "jestPassword", "jestFirst", "jestLast", "FALSE", "FALSE", "NULL", "NULL", "NULL")
    const client = await database.getClientByUserAndPass("jest@mail.com", "jestPassword")
    expect(client).toBeDefined()
    expect(client.first).toBe("jestFirst")
    await database.runQuery("DELETE FROM user WHERE email='jest@mail.com'")
  })
  it('should handle errors', async function() {
    const client = await database.getClientByUserAndPass("jest@mail.com", "badpassword")
    expect(client).toBeDefined()
    expect(client.Error).toBeDefined
  })
})

//GET CLIENT APPOINTMENTS
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

//GET STYLIST APPOINTMENTS
describe('getStylistAppointments', function() {
  it('should be a function', async function() {
    expect(typeof database.getStylistAppointments).toBe("function")
  })
  it('should be accurate', async ()=>{
    //create user, set to stylist.
    await database.createUser("jestGetStylistAppointments@mail.com", "jestPassword", "jestFirst", "jestLast", "FALSE", "FALSE", "NULL", "NULL", "NULL")
    await database.addStylist("jestGetStylistAppointments@mail.com", "biofortestingpurposes", [{id : "1", price : "20", deposit : "10", duration : "2"}])
    //get offerID
    let result = await database.runQuery("select offerID from offersStyle WHERE stylist = 'jestGetStylistAppointments@mail.com'");
    let offerID = result[0].offerID
    //add bookings
    await database.createBooking("jestGetStylistAppointments@mail.com", offerID, "2019-12-10", "09:30:00")
    await database.createBooking("jestGetStylistAppointments@mail.com", offerID, "2019-10-11", "09:40:00")
    //test
    result = await database.getStylistAppointments("jestGetStylistAppointments@mail.com");
    bookings = result.bookings;
    expect(bookings.length).toBe(2);
    expect(bookings[0].bookTime).toBe("09:30:00")
    expect(bookings[1].bookTime).toBe("09:40:00")

    //cleanup
    await database.runQuery(`DELETE FROM bookings WHERE offerID = ${offerID}`);
    await database.deleteStylistComponent("jestGetStylistAppointments@mail.com");
    await database.runQuery("DELETE from user WHERE email = 'jestGetStylistAppointments@mail.com'");
  })
})

//CREATE BOOKING
describe('createBooking', function() {
  it('should be accurate', async function() {
    expect(typeof database.createBooking).toBe("function")
    //create user and booking
    await database.createUser("jestCreateBooking@mail.com", "jestPassword", "jestFirst", "jestLast", "FALSE", "FALSE", "NULL", "NULL", "NULL")
    const status = await database.createBooking("jestCreateBooking@mail.com", "1", "2019-10-10", "09:30:00")
    expect(status).toBeDefined()
    expect(status).toBe(true)
    // cleanup
    const status1 = await database.runQuery("DELETE FROM bookings WHERE client = 'jestCreateBooking@mail.com' AND offerID = 1 AND bookDate = '2019-10-10' AND bookTime = '09:30:00'")
    const status2 = await database.runQuery("DELETE FROM user WHERE email = 'jestCreateBooking@mail.com'")
    expect(status1.affectedRows).toBe(1)
    expect(status2.affectedRows).toBe(1)
  })
  it('should handle errors', async function() {
    // TODO
  })
})

//ADD STYLIST COMPONENT
describe('addStylist', function() {
  it('should be a function', function() {
    expect(typeof database.addStylist).toBe("function")
  })
  it('should be accurate', async function() {
    // Create user first
    var status = await database.createUser("jestAddStylist@mail.com", "passwordfortestingpurposes", "first", "last", "FALSE", "FALSE", "NULL", "NULL", "NULL")
    // Change user to stylist and test it
    status = await database.addStylist("jestAddStylist@mail.com", "biofortestingpurposes", [{id : "1", price : "20", deposit : "10", duration : "2"}])
    expect(status).toBeDefined()
    expect(status).toBe(true)
    //make sure stylist was set in db
    let result = await database.runQuery("SELECT * FROM user WHERE email = 'jestAddStylist@mail.com' AND isStylist = true");
    expect(result.length).toBe(1);
    expect(result[0].stylistBio).toBe("biofortestingpurposes")

    // cleanup
    await database.deleteStylistComponent("jestAddStylist@mail.com");
    await database.runQuery("DELETE FROM user WHERE email='jestAddStylist@mail.com'")
  })
  it('should handle errors', async function() {
    //todo
  })
// TODO Create the stylist, test it, then delete it and test that
})



// TRANSACTION
describe('transaction', ()=>{
  it('should be a function', function() {
    expect(typeof database.transaction).toBe("function")
  })
  it('should perform successive queries', async function() {
    const query1 = "INSERT INTO user VALUES ('jestTransaction1@mail.com', 'testpassword', 'first', 'last', FALSE, FALSE, NULL, NULL, 2)"
    const query2 = "INSERT INTO user VALUES ('jestTransaction2@mail.com', 'testpassword', 'first', 'last', FALSE, FALSE, NULL, NULL, 2)"
    const status = await database.transaction([query1, query2])
    expect(status).toBeDefined()
    expect(status).toBe(true)
  })
  it('should rollback if query errors occur', async function() {
    const query1 = "INSERT INTO user VALUES ('jestTransaction1@mail.com', 'testpassword', 'first', 'last', FALSE, FALSE, NULL, NULL, 2)"
    const query3 = "INSERT INTO user VALUES ('jestTransaction3@mail.com', 'testpassword', 'first', 'last', FALSE, FALSE, NULL, NULL, 2)"
    //repeating query1 should result in duplicate error. query3 should not be added
    let status = await database.transaction([query3, query1])
    expect(status).toBeDefined()
    expect(status).toBe(false)
  })
  it('should not save db entries if there was an error', async ()=>{
    let results = await database.runQuery("SELECT * FROM user WHERE email = 'jestTransaction3@mail.com'");
    expect(results.length).toBe(0);
    await database.runQuery("DELETE FROM user WHERE email='jestTransaction1@mail.com'")
    await database.runQuery("DELETE FROM user WHERE email='jestTransaction2@mail.com'")
  })
  it('shoudl handle errors', ()=>{
    //todo?
  })
})
