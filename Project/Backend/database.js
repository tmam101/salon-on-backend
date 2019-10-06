const mysql = require('mysql');
const googleAPIKEY=process.env.GOOGLE_API_KEY;
const network = require('./network.js')

// Database properties
// TODO This creates an error upon startup no matter what if these credentials are invalid.
const connection = mysql.createConnection({
  host: process.env.HOSTNAME,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
  
});

//Connect to DB
function connect(){
	connection.connect((err) => {
  if (err) {
      console.log('Unable to connect to Db');
      return;
  }
  console.log('Connection established');
});
}

//Desconnect from DB
function disconnect(){
	connection.end ((err) => {
		// The connection is terminated gracefully
	  // Ensures all previously enqueued queries are still
	  // before sending a COM_QUIT packet to the MySQL server.
	})
}

//Playground
async function runExampleQueries() {
	// Example queries
	await runQuery("SELECT * FROM hairstyles")
}

async function runQuery(SQLString) {
	let results = null;
	//Promise, because of long fetch time
	let promise = new Promise((resolve, reject) => {
		connection.query(SQLString, (err,rows) => {
			if(err) {
				reject(err)
			} else {
				resolve(rows)
			}
		  });
	})
	//Promise successfull
	promise.then((message) => {
		console.log('Query Executed successfully \n Data received from Db:\n');
		console.log(message);
		results = message;						//THIS IS WHERE DATA IS LOCATED. WE CAN RETURN IT OR DO WHATEVER
	});
	//Promise failed
	promise.catch((message) => {console.log(message)});

	return results;
}

// TODO Is this necessary? It might be useful during server crashes because of errors.
function restartServer() {
	connection.end()
	//connection = mysql.createConnection(process.env.DATABASE_URL);
}

async function distanceBetweenTwoPoints(origin, destination) {
  // TODO Consider the matrix since this is a 3 way transaction
  origin.replace(" ", "+")
  origin.replace(",", "")
  destination.replace(" ", "+")
  destination.replace(",", "")
  const baseURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&"
  const parameters = "origins=" + origin + "&destinations=" + destination + "&key=" + googleAPIKEY
  const calculatedURL = baseURL + parameters
  var response = await network.get(calculatedURL)
  var distanceInMiles = response.rows[0].elements[0].distance.text.replace(" mi", "")
  var timeToTravel = response.rows[0].elements[0].duration.text // TODO This is so far unused
  // TODO We can also get these values in meters and seconds.
  return distanceInMiles
}

exports.connect = connect;
exports.runExampleQueries = runExampleQueries;
exports.distanceBetweenTwoPoints = distanceBetweenTwoPoints;
