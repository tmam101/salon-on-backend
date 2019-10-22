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

// ENDPOINTS
app.post('/amenity-by-id', getAmenityByID)
app.post('/refresh', refresh)
app.post('/client-by-id', getClientByID)  // TODO Unnecessary?
app.get('/', redirect)
app.post('/login', login)
app.post('/createuser', createUser)
app.post('/searchstylistslocation', searchStylistLocation)  // TODO

// ENDPOINT IMPLEMENTATION FUNCTIONS
async function getAmenityByID(req, res) {
  console.log("called get amenity by id");
  let id = req.query.id;
  let amenity = await database.getAmenityByID(id)
  if (amenity) {
    res.send(JSON.stringify(amenity));
  } else {
    // TODO Handle no amenity found.
  }
}

async function refresh(req, res) {
  console.log("refreshed");
  res.send(JSON.stringify({"response" : "1"}));
}

async function getClientByID(req, res) {
  console.log("called get Client by id");
  let id = req.query.id;
  if (!id) {
    // TODO Test
    res.send(JSON.stringify({"status" : "no ID provided"}))
  }
  let client = await database.getClientByID(id)
  if (client) {
    res.send(JSON.stringify(client));
  } else {
    // TODO Handle no client found.
  }
}

function redirect() {
  res.redirect('https://frosty-tereshkova-9806e1.netlify.com/index.html/')
}

//RETURNS PROFILE FROM LOGIN
async function login(req, res){
  console.log("attempting to login...");
  // Handle no parameters
  if (req.query == undefined) { // TODO This probably isn't right.
    console.log("Login Failed: No parameters");
    let status = {
      "status" : "Login Failed: No parameters"
    }
    res.send(JSON.stringify(status))
  }
  let user = req.query.user
  let pass = req.query.pass
  // Handle incorrect parameters
  if (!user || !pass) {
    res.send(JSON.stringify({"status" : "Login Failed: No parameters"}))
  }
  let clientProfile = await database.getClientByUserAndPass(user, pass);
  console.log(clientProfile)
  res.send(JSON.stringify({"profile" : clientProfile}))
}

async function createUser(req, res){
  console.log("called create user");
  // If no parameters,
  if (req.query == undefined) { // TODO This probably isn't right.
    console.log("Server error: No parameters");
    res.send(JSON.stringify({"status" : "no parameters"}))
  }
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
}

//SEARCH STYLIST BY LOCATION
async function searchStylistLocation(req, res){
  console.log("called search Stylist by location");
  if (req.query == undefined) { // TODO Probably not right
    console.log("Server error: No parameters");
    res.send(JSON.stringify({"status" : "no parameters"}))
  }
  info = req.query
  let zip = info.zip;
  let radius = info.radius;

  let profiles = await database.searchByLocation(parseInt(zip), parseInt(radius));
  res.send(JSON.stringify({"profiles" : profiles}))
}

exports.startServer=startServer;
