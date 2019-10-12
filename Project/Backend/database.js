const mysql = require('mysql');
const sha1 = require('sha1');

// DATABASE PROPERTIES
const connection = mysql.createConnection({
  host: process.env.HOSTNAME,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASE

});

//CONNECT TO DB
 function connect(){
	 connection.connect((err) => {
		 if (err) {
			 console.log('Unable to connect to Db');
			 return false;
		 } else {
			console.log('DB connection established');
			return true;
		 }
	 });
}

//DISCONNECT FROM DB
 function disconnect(){
	 connection.end((err) => {
		// The connection is terminated gracefully
	  // Ensures all previously enqueued queries are still
	  // before sending a COM_QUIT packet to the MySQL server.
	  if (err){
		  throw err
	  } else {
		console.log("ended Db connection")
	  }
	});
}



//	'GET ALL' QUERY FUNCTIONS
async function getAllHairStyles() {
	return await runQuery("SELECT * FROM hairstyles");
}
async function getAllAmenities() {
	return await runQuery("SELECT * FROM amenities");
}
async function getAllStylists() {
	return await runQuery("SELECT * FROM user WHERE isStylist=TRUE");
}
async function getAllClients() {
	return await runQuery("SELECT * FROM user");
}

//MORE QUERY FUNCTIONS
async function getAmenityByID(id){
	result = await runQuery(`SELECT * FROM amenities WHERE aid=${id}`);
	console.log("Got amenity from DB");
	return result[0];
}
async function getClientByID(email){
	result = await renQuery(`SELECT * FROM user WHERE email ='${email}'`);
	console.log("Got client from DB");
	return result[0];
}
async function getClientByUserAndPass(user, pass){
	result = await runQuery(`SELECT * FROM user WHERE email = '${user}' AND hashword = '${sha1(pass)}'`)
	if (result.length == 0){
		return {Error: "No user found"}
	}
	return[0];
}

//FUNCTION TO CREATE NEW ACCOUNT. 'isStylist' and 'isSalon" are booleans, and should be set 
//accordingly on the front end. Bio variables should be null when not applicable.

async function createUser(email, pass, first, last, isStylist, isSalon, stylistBio, salonBio){
	query = `INSERT INTO user VALUES ('${email}', '${sha1(pass)}', '${first}', '${last}', ${isStylist}, ${isSalon}, '${stylistBio}', '${salonBio}')`;
	console.log(query);
	status = await runQuery(query);
	if (!status){
		console.log("unable to create new user");
		return false;
	}
	console.log("new user created successfully");
	return true;
}

//ADDS STYLIST COMPONENT TO A USER ACCOUNT. 'styles' should be array of 
//style objects in the form {id: "id matching db table", price: "value", deposit: "value", duration: "time to complete"}
 function addstylist(email, stylistBio, styles){
	console.log("activating stylist account...")
	status = runQuery(`UPDATE user SET isStylist = TRUE, stylistBio = '${stylistBio}' WHERE EMAIL = '${email}'`)
	if (!status){
		console.log("FAILED: unable to activate stylist account");
		return false;
	}
	let styleQueries = [];
	console.log("adding hairstyles to stylist account..")
	styles.forEach((e) => {
		styleQueries.push(`INSERT INTO offersStyle VALUES ('${email}', ${e.id}, ${e.price}, ${e.deposit}, ${e.duration})`)
	});
	status = transaction(styleQueries);
	if (!status){
		console.log("FAILED: unable to add hairstyles to stylist account")
		return false;
	}
	console.log("stylist account activated successfully")
	return false;
}

//TODO: ADD SALON COMPONENT TO ACCOUNT.


//EXECUTE QUERY (run this for selects and single insertions)
function runQuery(SQLString) {
	//connect();
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
		console.log('Query Executed successfully: '+SQLString);
		//console.log(`Data received from Db:`)
		//console.log(message);
		disconnect()
		return message;					
	}).catch((message) => {
		console.log('Query Failed: '+ message)
		disconnect();
		return false;		//	QUERY FAILED
	});
}


//EXECUTE TRANSACTION (run this for multiple insertions)
 function transaction(queries) {
	//await connect();
	console.log("Beginning transaction...");
	 connection.beginTransaction((err) => {
		if (err) { 
			throw err;}
	  });
	  queries.forEach((e) => {		//loop through queries
		connection.query(e,(err) => {
			if (err) { 					//if one fails, throw error and revert changes
			  connection.rollback(() => {
				throw err;
			  });
			}
		});
	});
	  connection.commit();
	  console.log("Transaction commited successfully")
	  //disconnect();
	  return true;
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
exports.addstylist=addstylist;
exports.createUser=createUser;




