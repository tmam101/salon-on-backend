const	env = require('dotenv')
env.config()
const server = require('../Backend/server.js')
const network = require('../Backend/network.js')
const database = require('../Backend/database.js')

class Request {
  constructor(parameters) {
    this.query = parameters
  }
}

class Response {
  constructor() {
    this.value = undefined
    this.redirectURL = undefined
    this.send = function(words) {
      this.value = words
    }
    this.redirect = function(url) {
      this.redirectURL=url
    }
  }
}

describe('startServer', function() {
  it('should be accurate', async function() {
    const port = await server.startServer()
    const port2 = await server.startServer()
    expect(port).toBeDefined()
    expect(port2).toBe(port)
  })
})

describe('getAmenityByID', function() {
  it('should be accurate', async function() {
    var req = new Request({id: 1})
    var res = new Response()
    await server.getAmenityByID(req, res)
    console.log(res.value)
    expect(res.value).toBe("{\"aid\":1,\"name\":\"Dryer\"}")
  })
})

describe('refresh', function() {
  it('should be accurate', async function() {
    var res = new Response()
    await server.refresh(undefined, res)
    expect(res.value).toBe("{\"response\":\"1\"}")
  })
})

describe('getClientByID', function() {
  it('should be accurate', async function() {
    var req = new Request({id: "thomas@mail.com"})
    var res = new Response()
    await server.getClientByID(req, res)
    expect(res.value).toBe("{\"email\":\"thomas@mail.com\",\"hashword\":\"6af9a2627bbccb10cc866c46d6efc50da709dc19\",\"first\":\"goss\",\"last\":\"thomas\",\"isStylist\":0,\"isSalon\":0,\"stylistBio\":\"none\",\"salonBio\":\"none\",\"salonRate\":\"0\"}")
  })
})

describe('redirect', function() {
  it('should be accurate', async function() {
    var res = new Response()
    await server.redirect(undefined, res)
    expect(res.redirectURL).toBe('https://frosty-tereshkova-9806e1.netlify.com/index.html/')
  })
})

describe('login', function() {
  it('should be accurate', async function() {
    var req = new Request({user: "thomas@mail.com", pass: "thomastestpassword"})
    var res = new Response()
    await server.login(req, res)
    expect(res.value).toBe("{\"profile\":{\"email\":\"thomas@mail.com\",\"hashword\":\"6af9a2627bbccb10cc866c46d6efc50da709dc19\",\"first\":\"goss\",\"last\":\"thomas\",\"isStylist\":0,\"isSalon\":0,\"stylistBio\":\"none\",\"salonBio\":\"none\",\"salonRate\":\"0\"}}")
  })
  it('should handle errors', async function() {

  })
})

describe('createUser', function() {
  it('should be accurate', async function() {
    var req = new Request({
      user: "thomastest@mail.com",
      first: "thomas",
      last: "test",
      pass: "thomastestpassword",
      isStylist: "false",
      isSalon : "false",
      stylistBio: "null",
      salonBio: "null",
      salonRate: "null"
    })
    var res = new Response()
    await server.createUser(req, res)
    expect(res.value).toBeDefined()
    expect(JSON.parse(res.value).status).toBe(true)
    status = await database.runQuery("DELETE FROM user WHERE email='thomastest@mail.com'")
    expect(status).toBeDefined()
    expect(status.affectedRows).toBeDefined()
    expect(status.affectedRows).toBe(1)
  })
})

describe('searchStylistLocation', function() {
  it('should be accurate', async function() {
    var req = new Request({
      zip: 27514,
      radius: 10,
      addr: "700 Bolinwood Dr",
      city: "Chapel Hill",
      state: "NC"
    })
    var res = new Response()
    await server.searchStylistLocation(req, res)
    console.log(res.value)
    expect(res.value).toBeDefined()
    expect(JSON.parse(res.value).profiles).toBeDefined()
    expect(JSON.parse(res.value).profiles.length).toBeGreaterThan(0)
  })
})
