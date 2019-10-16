const http      = require('http');
const director  = require('director');
const database  = require('./database.js')
const express   = require('express')
var app = express()

//FUNCTION TO LAUNCH SERVER AND SET PORT, FOR LOCAL TESTING, CAN CHANGE .listen(xxxx) to whatever
function startServer(){
  let port = Number(process.env.PORT || 5000);
  app.listen(port)
  console.log("http server started")
}

app.post('/amenity-by-id', async function(req, res) {
  console.log("called get amenity by id");
  // Get amenity by ID and send it if its found.
  let id = req.query.id;
  let amenity = await database.getAmenityByID(id)
  if (amenity) {
    res.send(JSON.stringify(amenity));
  } else {
    // TODO Handle no amenity found.
  }
})

// TODO Delete?
app.post('/client-by-id', async function(req, res) {
  console.log("called get Client by id");
  // Get amenity by ID and send it if its found.
  let id = req.query.id;
  if (!id) {
    // TODO Test
    res.send(JSON.Stringify({"status" : "no ID provided"}))
  }
  let client = await database.getClientByID(id)
  if (client) {
    res.send(JSON.stringify(amenity));
  } else {
    // TODO Handle no client found.
  }
})

app.post('/refresh', (req, res) => {
  console.log("refreshed");
  object = {"response" : "1"}
  res.send(JSON.stringify(object));
})

app.post('/createuser', async function(req, res) {
  console.log("called create user");
  // Get user info from rquest.
  let properties = req.query
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
  res.send(JSON.stringify({"status" : status}))
})


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

// startServer();


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

exports.startServer=startServer;
