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
