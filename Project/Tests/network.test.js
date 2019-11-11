const	env = require('dotenv')
env.config()
const network = require('../Backend/network.js')


describe('get', function() {
  it('should be accurate', async function() {
    jest.setTimeout(30000);
    const response = await network.get("https://www.reddit.com/r/" + "dogelore" + "/top.json?t=" + "day" + "&limit=" + "100")
    expect(response).toBeDefined()
    expect(response.data).toBeDefined()
    expect(response.data.children).toBeDefined()
    expect(response.data.children.length).toBeGreaterThan(0)
  })
})

describe('post', function() {
  it('should be accurate', async function() {
    jest.setTimeout(30000);
    var response = await network.post("https://salon-on-backend.herokuapp.com/refresh", {});
    expect(response).toBeDefined()
    expect(response.statusCode).toBe(200)
    expect(response.body).toBe("{\"response\":\"1\"}")
  })
})

describe('searchstylistslocationNetwork', function() {
  it('should be accurate', async function() {
    jest.setTimeout(30000)
    var response = await network.post("https://salon-on-backend.herokuapp.com/searchstylistslocation?radius=10&zip=27514&addr=700 Bolinwood Dr&city=Chapel Hill&state=NC", undefined)
    expect(response).toBeDefined()
    var profiles = JSON.parse(response.body)
    expect(profiles).toBeDefined()
    var n = await network.post("https://salon-on-backend.herokuapp.com/searchstylistslocation", {radius: "10", zip: "27514", addr: "700 Bolinwood Dr", city: "Chapel Hill", state: "NC"})
    console.log(n)
    expect(n).toBeDefined()
    expect(JSON.parse(n.body)).toBeDefined()
  })
})
