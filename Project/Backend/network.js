const HTTPS     = require('https');
const request = require('request')

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

async function post(url, json) {
  return new Promise((resolve, reject) => {
    console.log("post url: " + url)
    request.post(url, json, (error, res, body) => {
      if (error) {
        console.log("POST url with error: " + url)
        console.error(error)
        reject(error)
        return
      }
      console.log(`statusCode: ${res.statusCode}`)
      console.log(body)
      resolve({statusCode: res.statusCode, body: body})
    })
  })
}

exports.get = get;
exports.post = post;
