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
    get: root
  },
  '/login' : {
    post : login
  },
  '/createuser' : {
    post : createUser
  }
});


//FUNCTION FOR HANDLING RESPONSE.
async function respond(response, value){
  await response.writeHead(200, {"Content-Type" : "application/json"});
  await response.write(JSON.stringify(value))
  await response.end()
}


//*****REQUEST FUNCTIONS*********

//TODO: CREATE USER
async function createUser(){
  console.log("called create user");
  // If no parameters,
  if (!this.req.chunks[0]) {
    console.log("Server error: No parameters");
    return null;
  }
  // Get user info from rquest.
  let email = JSON.parse(this.req.chunks[0]).user;
  let first = JSON.parse(this.req.chunks[0]).first;
  let last = JSON.parse(this.req.chunks[0]).last;
  let pass = JSON.parse(this.req.chunks[0]).pass;
  let isStylst = JSON.parse(this.req.chunks[0]).isStylist;
  let isSalon = JSON.parse(this.req.chunks[0]).isSalon;
  let stylistBio = JSON.parse(this.req.chunks[0]).stylistBio;
  let salonBio = JSON.parse(this.req.chunks[0]).salonBio;
  let salonRate = JSON.parse(this.req.chunks[0]).salonRate;
  

  let status = await database.createUser(email, pass, first, last, isStylst, isSalon, stylistBio, salonBio, salonRate);
  return status;
}
startServer();
 

//REFRESH
async function refresh(){
  console.log("refreshed");
  // Thomas: Respond only works with objects, I think.
  // I was getting an error with the 1 at least.
  object = {"response" : "1"}
  respond(this.res, object);
}

//REDIRECT ROOT TO APP WEBSITE
async function root(){
  this.res.writeHead(301,
    {"Location": 'https://frosty-tereshkova-9806e1.netlify.com/index.html/'}
  );
    this.res.end()
}

//RETURNS PROFILE FROM LOGIN
async function login(){
  console.log("attempting to login...");
  if (!this.req.chunks[0]) {
    console.log("Login Failed: No parameters");
    return null
  }
  let user = JSON.parse(this.req.chunks[0]).user;
  let pass = JSON.parse(this.req.chunks[0]).pass;
  let clientProfile = database.getClientByUserAndPass(user, pass);
  await respond(this.res, clientProfile);

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

// RETURNS CLIENT BY ID
async function getClientByID(){
  console.log("called get Client by id");
  // If no parameters,
  if (!this.req.chunks[0]) {
    console.log("Server error: No parameters");
    return null
  }
  // Get amenity by ID and send it if its found.
  let id = JSON.parse(this.req.chunks[0]).id;
  let amenity = await database.getClientByID(id)
  if (amenity) {
    await respond(this.res,amenity);
  } else {
    // TODO Handle no client found.
  }
}
