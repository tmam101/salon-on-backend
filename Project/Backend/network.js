const HTTPS     = require('https');
const index     = require('../index.js')
const http      = require('http');
const director  = require('director');
const database  = require('./database.js')
//todo consider using express instead

var server, port, router;

//MARK: SERVER
async function startServer() {
  var promise = new Promise(function(resolve, reject) {
    router = new director.http.Router({
      'amenity-by-id' : {
        post : function (){
          let value = database.getAmenityByID(JSON.parse(this.req.chunks[0]).id);
          console.log(value);
          respond2(this.res, value);
        }
      },

      '/client-by-id' : {
        post: getClientByID
      },
      '/refresh' : {
        post: function() {
          console.log("refreshed")
        },
        get: testGet
      },
      '/data' : {
        post: testPost,
        get: async function() {
          respond(this.res, async function() {
            var name = await database.runExampleQueries()
            console.log(name)
            return name
          })
        }
      }
      // '/stylists-by-location' : {
      //   post: testPost,
      //   get: testGet
      // },
      // '/salons-by-location' : {
      //   post: testPost,
      //   get: testGet
      // }
    });
    server = http.createServer(function (req, res) {
      req.chunks = [];
      req.on('data', function (chunk) {
        req.chunks.push(chunk.toString());
      });

      router.dispatch(req, res, function(err) {
        res.writeHead(err.status, {"Content-Type": "text/plain"});
        res.end(err.message);
      });
    });
      port = Number(process.env.PORT || 5000);
      server.listen(port);
      console.log("server started")
      resolve()
  })
  return promise
}

async function respond(response, callback) {
  await response.writeHead(200, {"Content-Type" : "application/json"});
  var result = await callback()
  await response.write(JSON.stringify(result))
  await response.end()
}

async function respond2(response, value){
  await response.writeHead(200, {"Content-Type" : "application/json"});
  await response.write(value)
  await response.end()
}

async function getdata (){
  let value = database.getAmenityByID(1);
  console.log(value);
  respond2(this.res, value);
}

function testPost() {

}

async function getClientByID() {
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
    await respond(this.res, function() {
      object = {
        "firstName" : "Thomas"
      }
      return object
    })
  } else {
    await respond(this.res, function() {
      object = {
        "firstName" : "Ethan"
      }
      return object
    })
  }
}

function testGet() {
  console.log("testGet")
  respond(this.res, function() {
    object = {
      "testKey" : "testValue"
    }
    return object
  })
}

function respondToGet() {
}

function respondToPost() {
  index.respondToPost(this.req, this.res);
}




exports.startServer = startServer;
exports.get = get;
exports.post = post;
exports.getdata=getdata;
