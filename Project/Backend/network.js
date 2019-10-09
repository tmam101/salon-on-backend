const HTTPS     = require('https');

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
    if(res.statusCode > 299 || res.statusCode < 200) {
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

exports.get = get;
exports.post = post;
