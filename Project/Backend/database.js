//const mysql = require('mysql');
const sha1 = require('sha1');
const proxy=require('./proxy.js');

// DATABASE PROPERTIES
const connection = mysql.createConnection({
  host: process.env.HOSTNAME,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASE

});

//CONNECT TO DB
async function connect(){
	dbConnection.connect((err) => {
  if (err) {
	  console.log('Unable to connect to Db');
      return;
  }
  console.log('DB connection established');
});
}

//DISCONNECT FROM DB
function disconnect(){
	connection.end ((err) => {
		// The connection is terminated gracefully
	  // Ensures all previously enqueued queries are still
	  // before sending a COM_QUIT packet to the MySQL server.
	})
}



//	QUERY FUNCTIONS
async function getAllHairStyles() {
	return await runQuery("SELECT * FROM hairstyles");
}
async function getAllAmenities() {
	return await runQuery("SELECT * FROM amenities");
}
async function getAllStylists() {
	return await runQuery("SELECT * FROM stylists");
}
async function getAllClients() {
	return await runQuery("SELECT * FROM clients");
}
async function getAmenityByID(id){
	result = await runQuery(`SELECT * FROM amenities WHERE aid=${id}`);
	console.log("Got amenity from DB");
	return result[0];
}
async function getClientByID(id){
	result = await renQuery(`SELECT * FROM clients WHERE cid =${id}`);
	console.log("Got client from DB");
	return result[0];
}
async function getClientByUserAndPass(user, pass){
	result = await runQuery(`SELECT * FROM clients WHERE email = ${user} AND hashword = ${sha1(pass)}`)
	if (result.length == 0){
		return {Error: "No user found"}
	}
	return[0];
}
async function createUser(first, last, email, pass){
	status = runQuery(`INSERT INTO clients VALUES (NULL, ${first}, ${last}, ${email}, ${sha1(pass)})`)
	if (!status){
		return false;
	}
	return true;
}

//EXECUTE QUERY
async function runQuery(SQLString) {
	//Promise, because of long fetch time
	return new Promise((resolve, reject) => {
		connection.query(SQLString, (err,rows) => {
			if(err) {
				reject(err)
			} else {
				resolve(rows)
			}
		  });
	}).then((message) => {
		console.log('Query Executed successfully');
		//console.log(`Data received from Db:`)
		//console.log(message);
		return message;					
	}).catch((message) => {
		console.log(message)
		return false;		//	QUERY FAILED
	});
}



//EXPORTS
exports.connect= connect;
exports.disconnect=disconnect;
exports.getAllAmenities= getAllAmenities;
exports.getAllClients=getAllClients;
exports.getAllHairStyles=getAllHairStyles;
exports.getAllStylists=getAllStylists;
exports.getAmenityByID=getAmenityByID;
exports.getClientByID=getClientByID;
exports.getClientByUserAndPass=getClientByUserAndPass;




