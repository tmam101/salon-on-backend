const http      = require('http');
const director  = require('director');
const database  = require('./database.js')
const express   = require('express')

var app = express()
//todo consider using express instead
exports.startServer=startServer;

// //CODE THAT SETS OF THE HTTP SERVER.
// let server = http.createServer(async (req, res) => {
//   req.chunks = [];
//   req.on('data', function (chunk) {
//     req.chunks.push(chunk.toString());
//   });
//
//   router.dispatch(req, res, function(err) {
//     res.writeHead(err.status, {"Content-Type": "text/plain"});
//     res.end(err.message);
//   });
// });

//FUNCTION TO LAUNCH SERVER AND SET PORT, FOR LOCAL TESTING, CAN CHANGE .listen(xxxx) to whatever
function startServer(){
  let port = Number(process.env.PORT || 5000);
  app.listen(port)
  // server.listen(port);
  console.log("http server started")
}

// //ROUTER FOR FORWARDING REQUEST INFO TO METHODS
// let router = new director.http.Router({
//   '/amenity-by-id' : {
//     post : getAmenityByID
//   },
//   '/client-by-id' : {
//     post: getClientByID
//   },
//   '/refresh' : {
//     post: refresh
//   },
//   '/' : {
//     get: root
//   },
//   '/login' : {
//     post : login
//   },
//   '/createuser' : {
//     post : createUser
//   },
//   '/searchstylistslocation' : {
//     post : searchStylistLocation
//   }
// });

app.post('/amenity-by-id', async function(req, res) {
  console.log("called get amenity by id");
  // Get amenity by ID and send it if its found.
  let id = req.query.id;
  console.log(id)
  let amenity = await database.getAmenityByID(id)
  if (amenity) {
    res.send(JSON.stringify(amenity));
  } else {
    // TODO Handle no amenity found.
  }
})


//FUNCTION FOR HANDLING RESPONSE.
async function respond(response, value){
  await response.writeHead(200, {"Content-Type" : "application/json"});
  await response.write(JSON.stringify(value))
  await response.end()
}


//*****REQUEST FUNCTIONS*********

//SEARCH STYLIST BY LOCATION
  async function searchStylistLocation(){
    console.log("called search Stylist by location");
    if (!this.req.chunks[0]) {
      console.log("Server error: No parameters");
      return null;
    }
    info = JSON.parse(this.req.chunks[0])
    let zip = info.zip;
    let radius = info.radius;

    let profiles = await database.searchByLocation(parseInt(zip), parseInt(radius));
    await respond (this.res, profiles)
  }


//CREATE USER
async function createUser(){
  console.log("called create user");
  // If no parameters,
  if (!this.req.chunks[0]) {
    console.log("Server error: No parameters");
    return null;
  }
  // Get user info from rquest.
  let properties = JSON.parse(this.req.chunks[0])
  console.log(properties)
  // TODO ETHAN: I'm unsure of what to enter when its null.  Is it null like this, or "null" in quotes?
  let email = properties.user  != undefined ? properties.user : null;
  let first = properties.first != undefined ? properties.first : null;
  let last = properties.last != undefined ? properties.last : null;
  let pass = properties.pass != undefined ? properties.pass : null;
  let isStylist = properties.isStylist != undefined ? properties.isStylist : null;  //todo broken?
  let isSalon = properties.isSalon != undefined ? properties.isSalon : null;
  let stylistBio = properties.stylistBio != undefined ? properties.stylistBio : null
  let salonBio = properties.salonBio != undefined ? properties.salonBio : null;
  let salonRate = properties.salonRate != undefined ? properties.salonRate : null


  // TODO This is a bool, will it return properly?
  let status = await database.createUser(email, pass, first, last, isStylist, isSalon, stylistBio, salonBio, salonRate);
  let object = {
    "status" : status
  }
  respond(this.res, object)
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
  // Handle no parameters
  if (!this.req.chunks[0]) {
    console.log("Login Failed: No parameters");
    let status = {
      "status" : "Login Failed: No parameters"
    }
    await respond(this.res, status)
  }
  let user = JSON.parse(this.req.chunks[0]).user;
  let pass = JSON.parse(this.req.chunks[0]).pass;
  // Handle incorrect parameters
  if (!user || !pass) {
    let status = {
      "status" : "Login Failed: No parameters"
    }
    await respond(this.res, status)
  }
  let clientProfile = await database.getClientByUserAndPass(user, pass);
  console.log(clientProfile)
  let returnObject = {
    "profile" : clientProfile
  }
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
