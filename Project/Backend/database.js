const mysql = require('mysql');

// Database properties
const connection = mysql.createConnection({
  host: process.env.HOSTNAME,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASE

});

//Connect to DB
async function connect(){
	connection.connect((err) => {
  if (err) {
	  console.log('Unable to connect to Db');
      return;
  }
  console.log('DB connection established');
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
	console.log(result[0]);
	return result[0];

}


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



//exports
exports.connect= connect;
exports.disconnect=disconnect;
exports.getAllAmenities= getAllAmenities;
exports.getAllClients=getAllClients;
exports.getAllHairStyles=getAllHairStyles;
exports.getAllStylists=getAllStylists;
exports.getAmenityByID=getAmenityByID;




