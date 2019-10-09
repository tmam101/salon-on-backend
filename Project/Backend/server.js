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
    post: refresh,
    get: refresh
  },
  '/' : {
    get: function() {
      console.log("made it")
      refresh
    }
  }
});


//FUNCTION FOR HANDLING RESPONSE.
async function respond(response, value){
  await response.writeHead(200, {"Content-Type" : "application/json"});
  await response.write(JSON.stringify(value))
  await response.end()
}

//FUNCTION ASSOCIATED WITH REFRESH, NORMALLY WOULD JUST RESPOND WITH "1",
//BUT I HAVE BEEN USING IT AS A TEST FUNCTION (BECAUSE IT REQUIRES NO PARAMETERS AND
// YOU CAN TEST WITH YOUR WEB BROWSER BY GOING TO address/refresh)

async function refresh(){
  console.log("refreshed");
  // Thomas: Respond only works with objects, I think.
  // I was getting an error with the 1 at least.
  object = {
    "response" : "1"
  }
  respond(this.res, object);
}

//Returns JSON OBJECT of the matching amenity.
async function getAmenityByID(){
  console.log("called get amenity by id");
  // If no parameters,
  if (!this.req.chunks[0]) {
    console.log("Server error: No parameters");
    return null
  }
  // Get amenity by ID and send it if its found.
  let id = JSON.parse(this.req.chunks[0]).id;
  let amenity = await database.getAmenityByID(id)
  if (amenity) {
    await respond(this.res,amenity);
  } else {
    // TODO Handle no amenity found.
  }
}

// Returns client from id
async function getClientByID() {
  console.log("called get client by id");
  // Handle no parameters
  if (!this.req.chunks[0]) {
    console.log("no parameters")
    return null
  }
  // Get clientID from parameters
  var request = JSON.parse(this.req.chunks[0])
  var clientID = request.clientID
  // Handle incorrect parameters
  if (!clientID) {
    onsole.log("API issue: Incorrect parameters")
    object = {
      "serverIssue" : "Incorrect parameters"
    }
    await respond(this.res, object)
  }
  // Handle client ID 1
  if (Number(clientID) == 1) {
    object = {
      "firstName" : "Thomas"
    }
    await respond(this.res, object)
  } else {
    // Handle other client IDs
    object = {
      "firstName" : "Ethan"
    }
    await respond(this.res, object)
  }
}
