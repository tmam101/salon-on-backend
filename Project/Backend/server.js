const database  = require('./database.js')
const express   = require('express')
const bodyParser = require('body-parser')
var app = express()
var portNumber = undefined
var listener = undefined

//FUNCTION TO LAUNCH SERVER AND SET PORT, FOR LOCAL TESTING, CAN CHANGE .listen(xxxx) to whatever
async function startServer(){
  return new Promise((resolve, reject) => {
    if (portNumber != undefined) {
      console.log("port defined already")
      resolve(portNumber)
    } else {
      try {
        listener = app.listen(process.env.PORT || 5000, function() {
          portNumber = listener.address().port
          console.log("http server started on port " + portNumber)
          resolve(portNumber)
        })
      } catch (error) {
        console.log("Couldn't bind to port")
        reject()
      }
    }
  })
}

// ENDPOINTS
app.use(bodyParser.urlencoded({extended: true,limit: '50mb'}))
//app.use(bodyParser.json({limit: '50mb'}))
//app.use(multer());
app.post('/amenity-by-id', getAmenityByID)
app.post('/refresh', refresh)
app.post('/client-by-id', getClientByID)
app.get('/', redirect)
app.post('/login', login)
app.post('/createuser', createUser)
app.post('/add-stylist', addStylist)
app.post('/get-styles', getAllStyles)
app.post('/searchstylistslocation', searchStylistLocation)  // TODO
app.post('/update-profile-photo', updateProfilePhoto)
app.post('/get-profile-photo', getProfilePhoto)
app.post('/add-location', addLocation)
app.post('/add-rating', addRating)
app.post('/add-salon', addSalon)
app.post('/get-rating', getRatings)
app.post('/delete-user', deleteUser)
app.post('/get-amenities', getAllAmenities)
app.post('/get-client-bookings', getClientBookings)
app.post('/get-stylist-bookings', getStylistBookings)
app.post('/confirm-booking', confirmBooking)
app.post('/get-stylist-offers', getStylistOffers)
app.post('/create-booking', createBooking)

// ***************** ENDPOINT IMPLEMENTATION FUNCTIONS *********************

async function getStylistOffers(req, res){
  let email = req.query.id;
  let results = await database.getStylistOffers(email);
  console.log(results)
  if (results === false){
    res.send(JSON.stringify({"status": false}))
  } else {
    res.send(JSON.stringify({"status": true, "results":results}))
  }
}

async function getAllAmenities(req, res){
  let results = await database.getAllAmenities();
  if (results == false){
    res.send(JSON.stringify({"status": false}))
  } else {
    res.send(JSON.stringify({"status": true, "results":results}))
  }
}

async function getClientBookings(req, res){
  let email = req.query.id;
  let results = await database.getClientAppointments(email);
  console.log(results)
  if (results === false){
    res.send(JSON.stringify({"status": false}))
  } else {
    res.send(JSON.stringify({"status": true, "results":results}))
  }
}

async function getStylistBookings(req, res){
  let email = req.query.id;
  let results = await database.getStylistAppointments(email);
  if (results === false){
    res.send(JSON.stringify({"status": false}))
  } else {
    res.send(JSON.stringify({"status": true, "results":results}))
  }
}

async function createBooking(req, res){
  let client = req.query.client;
  let offer = req.query.offer;
  let date = req.query.date;
  let time = req.query.time;

  let result = await database.createBooking(client, offer, date, time);
  res.send(JSON.stringify({"status": result}))

}

async function confirmBooking(req, res){
  let bid = req.query.bid;
  let accountType = req.query.accountType;
  let result = await database.confirmBooking(bid, accountType);
  if (result){
    res.send(JSON.stringify({"status": true}))
  } else {
    res.send(JSON.stringify({"status": false}))
  }
}

async function deleteUser(req, res){
  let email = req.query.id;
  let result = await database.deleteUser(email);
  if (result){
    res.send(JSON.stringify({"status": true}))
  } else {
    res.send(JSON.stringify({"status": false}))
  }
}
async function addLocation(req, res){
  info = req.query;
  let zip = info.zip;
  let address = info.addr+" "+info.city+" "+info.state;
  let email = info.id;
  let result = await database.addLocation(email, address, zip)
  if (result){
    res.send(JSON.stringify({"status": true}))
  } else {
    res.send(JSON.stringify({"status": false}))
  }
}

async function updateProfilePhoto(req, res){
  info = req.body
  let email = info.id;
  let pic = info.photo;

  let status= await database.updateProfilePhoto(email, pic);
  res.send(JSON.stringify({"status": status}))
}

async function getProfilePhoto(req, res){
  let email = req.query.id
  result = await database.getProfilePhoto(email);
  if (result === false){
    res.send(JSON.stringify({"status":false}))
  } else {
    res.send(JSON.stringify({"status":true,"results":result}))
  }
}

async function addRating(req, res){
  let stylist = req.query.stylist;
  let client = req.query.email;
  let clean = req.query.clean;
  let pro = req.query.pro;
  let friend = req.query.friend;
  let access = req.query.access;
  let comment = req.query.comment;
  let result = await database.addRating(stylist, client, clean, pro, friend, access, comment)
  res.send(JSON.stringify({"status":result}));
}

async function getRatings(req, res){
  let email = req.query.id;
  let results = await database.getAverageRatings(email);
  if (results == false){
    res.send(JSON.stringify({"status":false}))
  }
  res.send(JSON.stringify({"status":true,"results":results}))
}

async function getAllStyles(req, res){
  let results=await database.getAllHairStyles()
  if (results){
    res.send(JSON.stringify({"status":true,"results":results}))
  } else {
    res.send(JSON.stringify({"status":false}))
  }
}


async function getAmenityByID(req, res) {
  console.log("called get amenity by id " + req.query.id);
  let id = req.query.id;
  let amenity = await database.getAmenityByID(id)
  if (amenity) {
    res.send(JSON.stringify(amenity));
  } else {
    res.send(JSON.stringify({"status":"No amenity found"}))
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
    res.send(JSON.stringify({"status" : "no ID provided"}))
  }
  let client = await database.getClientByID(id)
  if (client === false) {
    res.send(JSON.stringify({"status":false}));
  } else {
    res.send(JSON.stringify({"status":true, "results":client}))
  }
}

//ADD STYLIST COMPONENT AND OFFERS TO ACCOUNT
async function addStylist(req, res){
  let email = req.query.id;
  let bio = req.query.bio;
  let styles = JSON.parse(req.query.styles);
  result = await database.addStylist(email, bio, styles.styleArray)
  res.send(JSON.stringify({"status": status}))
}

async function addSalon(req, res){
  let email = req.query.id;
  let bio = req.query.bio;
  let amenities = JSON.parse(req.query.amenities); //parse array from string
  let status = await database.addSalon(email, bio, amenities)
  res.send(JSON.stringify({"status": status}))
}

//REDIRECT ROOT TO PROJECT SITE
function redirect(req, res) {
  res.redirect('https://frosty-tereshkova-9806e1.netlify.com/index.html/')
}

//RETURNS PROFILE FROM LOGIN
async function login(req, res){
  console.log("attempting to login...");
  // Handle no parameters
  if (req.query == undefined) { // TODO This probably isn't right.
    console.log("Login Failed: No parameters");
    res.send(JSON.stringify({"status" : "Login Failed: No parameters"}))
    return
  }
  let user = req.query.user
  let pass = req.query.pass
  // Handle incorrect parameters
  if (!user || !pass) {
    res.send(JSON.stringify({"status" : "Login Failed: No parameters"}))
    return
  }
  let clientProfile = await database.getClientByUserAndPass(user, pass);
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
//NEED TO CHANGE REQUEST TO CONTAIN ADDRESS IN FORM: {addr: "123 BLAH BLAH", city:"chapel hill", state: "NC", zip: "27514"}
async function searchStylistLocation(req, res){
  console.log("called search Stylist by location");
  if (req.query == undefined) { // TODO Probably not right
    console.log("Server error: No parameters");
    res.send(JSON.stringify({"status" : "no parameters"}))
  }
  info = req.query;
  let zip = info.zip;
  let address = info.addr;
  let radius = info.radius;

  let profiles = await database.searchStylistsSpecificLocation(address, parseInt(zip), parseInt(radius));
  res.send(JSON.stringify(profiles))
}

exports.startServer=startServer;
exports.getAmenityByID = getAmenityByID;
exports.refresh = refresh;
exports.getClientByID=getClientByID;
exports.redirect=redirect;
exports.login=login;
exports.createUser=createUser;
exports.searchStylistLocation=searchStylistLocation;
