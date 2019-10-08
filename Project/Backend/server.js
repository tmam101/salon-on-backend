const http      = require('http');
const director  = require('director');
const database  = require('./database.js')
//todo consider using express instead
exports.startServer=startServer;

//CODE THAT SETS OF THE HTTP SERVER.
let server = http.createServer(async (req, res) => {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});

//FUNCTION TO LAUNCH SERVER AND SET PORT, FOR LOCAL TESTING, CAN CHANGE .listen(xxxx) to whatever
function startServer(){
  let port = Number(process.env.PORT || 5000);
  server.listen(port);
  console.log("http server started")
}

//ROUTER FOR FORWARDING REQUEST INFO TO METHODS
let router = new director.http.Router({
  '/amenity-by-id' : {
    post : getAmenityByID
  },
  '/client-by-id' : {
    post: getClientByID
  },
  '/refresh' : {
    get: refresh
  },
  '/' : {
    get: () => {
      console.log("made it");
    }
  }
});


//FUNCTIONS FOR HANDLEING RESPONSE. #2 SEEMS TO BE WORKING. MAY REMOVE #1
async function respond(response, callback) {
  await response.writeHead(200, {"Content-Type" : "application/json"});
  var result = await callback()
  await response.write(JSON.stringify(result))
  await response.end()
}

async function respond2(response, value){
  await response.writeHead(200, {"Content-Type" : "application/json"});
  await response.write(JSON.stringify(value))
  await response.end()
}

//FUNCTION ASSOCIATED WITH REFRESH, NORMALLY WOULD JUST RESPOND WITH "1",
//BUT I HAVE BEEN USING IT AS A TEST FUNCTION (BECAUSE IT REQUIRES NO PARAMETERS AND
// YOU CAN TEST WITH YOUR WEB BROWSER BY GOING TO address/refresh)

async function refresh(){
  console.log("refreshed");
  object = {
    "response" : "1"
  }
  respond2(this.res, object);
}

//Returns JSON OBJECT of the matching amenity.
async function getAmenityByID(){
  console.log("called get amenity by id");
  if (!this.req.chunks[0]) {
    console.log("Server error: No parameters");
    return null
  }
  let id = JSON.parse(this.req.chunks[0]).id;
  let amenity = await database.getAmenityByID(id)
  console.log(amenity)
  console.log(amenity.id);
  await respond2(this.res,amenity);
}

//Returns client from id, TODO: CHANGE TO USE RESPOND #2
async function getClientByID() {
  console.log("called get client by id");
  if (!this.req.chunks[0]) {
    console.log("no parameters")
    return null
  }
  var request = JSON.parse(this.req.chunks[0])
  var clientID = request.clientID
  if (!clientID) {
    await respond(this.res, function() {
      console.log("API issue: Incorrect parameters")
      object = {
        "serverIssue" : "Incorrect parameters"
      }
      return object
    })
  }
  if (Number(clientID) == 1) {
    object = {
      "firstName" : "Thomas"
    }
    respond2(this.res, object)
    // await respond(this.res, function() {
    //   object = {
    //     "firstName" : "Thomas"
    //   }
    //   return object
    // })
  } else {
    await respond(this.res, function() {
      object = {
        "firstName" : "Ethan"
      }
      return object
    })
  }
}
