const	env = require('dotenv')
env.config()
const network = require('../Backend/network.js')


describe('get', function() {
  jest.setTimeout(30000);
  it('should be accurate', async function() {
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
    options = {
  		hostname: "salon-on-backend.herokuapp.com",
  		path: '/refresh',
  		method: 'POST'
  	};
  	body = {
      "text" : "refresh"
    };
    var response = await network.post("https://salon-on-backend.herokuapp.com/refresh", body);
    expect(response).toBeDefined()
    expect(response.statusCode).toBe(200)
    expect(response.body).toBe("{\"response\":\"1\"}")
  })
})

// describe('post', function() {
//   it('should be accurate', async function() {
//     options = {
//   		hostname: "https://www.reddit.com",
//   		path: "/r/" + "dogelore" + "/top.json?t=" + "day" + "&limit=" + "100",
//   		method: 'POST'
//   	};
//   	body = {
//     };
//     const response = await network.post(options, body)
//     console.log(response)
//     expect(response).toBeDefined()
//   })
// })
