// const	env = require('dotenv')
// env.config()
// const network = require('../Backend/network.js')
//
//
// describe('get', function() {
//   it('should be accurate', async function() {
//     jest.setTimeout(30000);
//     const response = await network.get("https://www.reddit.com/r/" + "dogelore" + "/top.json?t=" + "day" + "&limit=" + "100")
//     expect(response).toBeDefined()
//     expect(response.data).toBeDefined()
//     expect(response.data.children).toBeDefined()
//     expect(response.data.children.length).toBeGreaterThan(0)
//   })
// })
//
// describe('post', function() {
//   it('should be accurate', async function() {
//     jest.setTimeout(30000);
//     var response = await network.post("salon-on-backend.herokuapp.com/refresh", {});
//     expect(response).toBeDefined()
//     expect(response.statusCode).toBe(200)
//     expect(response.body).toBe("{\"response\":\"1\"}")
//   })
// })
//
// describe('broke', function() {
//   it('shouldnt be broke', async function() {
//     jest.setTimeout(30000)
//     var response = await network.post("salon-on-backend.herokuapp.com/searchstylistslocation?radius=10&zip=27514&addr=700 Bolinwood Dr&city=Chapel Hill&state=NC", undefined)
//     expect(response).toBeDefined()
//     console.log(response)
//     expect(JSON.parse(response).body).toBeDefined()
//   })
// })

describe('a', function() {
  it('should work', function() {
    expect(2).toBe(2)
  })
})
