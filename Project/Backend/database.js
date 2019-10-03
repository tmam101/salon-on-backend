// const mysql = require('mysql');
//
// // Database properties
// // TODO This creates an error upon startup no matter what if these credentials are invalid.
// // const connection = mysql.createConnection({
// //   host: process.env.HOSTNAME,
// //   user: process.env.DBUSER,
// //   password: process.env.PASSWORD,
// //   database: process.env.DATABASE
// // });
//
// //Connect to DB
// function connect(){
// 	connection.connect((err) => {
//   if (err) {
//       console.log('Unable to connect to Db');
//       return;
//   }
//   console.log('Connection established');
// });
// }
//
// //Desconnect from DB
// function disconnect(){
// 	connection.end ((err) => {
// 		// The connection is terminated gracefully
// 	  // Ensures all previously enqueued queries are still
// 	  // before sending a COM_QUIT packet to the MySQL server.
// 	})
// }
//
// //Playground
// async function runExampleQueries() {
// 	// Example queries
// 	await runQuery("SELECT * FROM stylists")
// }
//
//
//
//
// async function runQuery(SQLString) {
// 	let results = null;
// 	//Promise, because of long fetch time
// 	let promise = new Promise((resolve, reject) => {
// 		connection.query(SQLString, (err,rows) => {
// 			if(err) {
// 				reject(err)
// 			} else {
// 				resolve(rows)
// 			}
// 		  });
// 	})
// 	//Promise successfull
// 	promise.then((message) => {
// 		console.log('Query Executed successfully \n Data received from Db:\n');
// 		console.log(message);
// 		results = message;						//THIS IS WHERE DATA IS LOCATED. WE CAN RETURN IT OR DO WHATEVER
// 	});
// 	//Promise failed
// 	promise.catch((message) => {console.log(message)});
//
// 	return results;
// }
//
// // TODO Is this necessary? It might be useful during server crashes because of errors.
// function restartServer() {
// 	connection.end()
// 	//connection = mysql.createConnection(process.env.DATABASE_URL);
// }
// runExampleQueries();
//
// exports.connect = connect;
// exports.runExampleQueries = runExampleQueries;
// exports.distanceBetweenTwoPoints = distanceBetweenTwoPoints;

const googleAPIKEY='AIzaSyCgDS5ZY-EXYpG2lG-w50mqa8yM4bNX9Ls'
const network = require('./network.js')

async function distanceBetweenTwoPoints(origin, destination) {
  // TODO could probably just do origin.replace
  // TODO Consider the matrix since this is a 3 way transaction
  var address1 = origin.replace(" ", "+")
  address1 = address1.replace(",", "")
  var address2 = destination.replace(" ", "+")
  address2 = address2.replace(",", "")
  var response = await network.get("https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + address1 + "&destinations=" + address2 + "&key=" + googleAPIKEY)
  // console.log(response);
  var distanceInMiles = response.rows[0].elements[0].distance.text.replace(" mi", "")
  console.log(distanceInMiles)
}

exports.distanceBetweenTwoPoints = distanceBetweenTwoPoints;
