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
      '/' : {
        post: respondToPost,
        get: respondToGet
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
            var name = await database.getSomething()
            console.log(name)
            return name
          })
        }
      }
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
  response.writeHead(200, {"Content-Type" : "application/json"});
  var result = await callback()
  response.write(JSON.stringify(result))
  response.end()
}

function testPost() {
  console.log("testPost")
}

function testGet() {
  console.log("testGet")
}

function respondToGet() {
}

function respondToPost() {
  index.respondToPost(this.req, this.res);
}

//MARK: HTTPS FUNCTIONS
async function get(url) {
  var promise = new Promise(function(resolve, reject) {
    HTTPS.get(url, (resp) => {
      let data = '';
      resp.on('data', (chunk) => {
        data += chunk;
      });
      resp.on('end', () => {
        // Do the actual work
        resolve(JSON.parse(data))
      });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
      reject()
    });
  });
  return promise
}

function post(options, body) {
  var botReq;
  botReq = HTTPS.request(options, function(res) {
    // console.log(res)
    if(res.statusCode != 202) {
      console.log('rejecting bad status code ' + res.statusCode);
    } else {
      // console.log('good status code')
    }
  });
  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

exports.startServer = startServer;
exports.get = get;
exports.post = post;
