const mysql = require('mysql');
const sha1 = require('sha1');
var zipcodes = require('zipcodes');

// DATABASE PROPERTIES
const connection = mysql.createConnection({
  host: process.env.HOSTNAME,
  user: process.env.DBUSER,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASE

});



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
async function searchStylists(term){
	results = await runQuery(`SELECT * FROM user WHERE isStylist = true AND first like '%${term}%' OR last like '%${term}%'`)
	return JSON.stringify(results);
}
async function searchByLocation(zip, radius){
	console.log("Searching stylists by zipcode...")
	zips = zipcodes.radius(zip, radius)
	//WILL ALWAYS RETURN AT LEAST USER ZIP
	query = `SELECT * FROM user WHERE user.email = isLocated.email isStylist=true AND (zip=${zips[0]} `

	//IF THERE ARE MORE ZIPS:
	if (zips.length>1){
		for (let i=1; i< zips.length; i++){
			query+= `or zip =${zips[i]} `
		}
	}
	query+= `);`
	results = await runQuery(query);
	if (results.length==0){
		console.log("No styists found near zipcode")
		return {sorry: "No stylists found"}
	}
	console.log(`Found ${results.length} stylists near zipcode`)
	return {"profiles": results}
}


// array = [123, 35654, 33535]
// console.log({key: array});
// console.log(JSON.stringify(array));

async function getAmenityByID(id){
	result = await runQuery(`SELECT * FROM amenities WHERE aid=${id}`);
	console.log("Got amenity from DB");
	return result[0];
}
async function getClientByID(email){
	result = await runQuery(`SELECT * FROM user WHERE email ='${email}'`);
	console.log("Got client from DB");
	return result[0];
}
async function getClientByUserAndPass(user, pass){
	result = await runQuery(`SELECT * FROM user WHERE email = '${user}' AND hashword = '${sha1(pass)}'`)
	if (result.length == 0){
		return {Error: "No user found"}
	}
	return result[0];
}



//FUNCTION TO CREATE NEW ACCOUNT. 'isStylist' and 'isSalon" are booleans, and should be set
//accordingly on the front end. Bio variables and salonRate should be null when not applicable.

async function createUser(email, pass, first, last, isStylist, isSalon, stylistBio, salonBio, salonRate){
	query = `INSERT INTO user VALUES ('${email}', '${sha1(pass)}', '${first}', '${last}', ${isStylist}, ${isSalon}, '${stylistBio}', '${salonBio}', '${salonRate}')`;
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

async function addstylist(email, stylistBio, styles){
	//TOGGLES isStylist TO TRUE
	console.log("activating stylist account...")
	status =  await runQuery(`UPDATE user SET isStylist = TRUE, stylistBio = '${stylistBio}' WHERE EMAIL = '${email}'`)
	if (!status){
		console.log("FAILED: unable to activate stylist account");
		return false;
	}
	//ADDS HAIRSTYLES TO offersStyle.
	let styleQueries = [];
	console.log("Adding hairstyles to stylist account..")
	styles.forEach((e) => {
		styleQueries.push(`INSERT INTO offersStyle VALUES ('${email}', ${e.id}, ${e.price}, ${e.deposit}, ${e.duration})`)
	});
	status = await transaction(styleQueries);
	if (!status){
		console.log("FAILED: unable to add hairstyles to stylist account")
		return false;
	}
	console.log("Stylist account activated successfully")
	return false;
}



//TODO: ADD SALON COMPONENT TO ACCOUNT.





//******DATABASE CONNECTION AND RUN-QUERY FUNCTIONS *********/

//CONNECT TO DB
async function connect(){
	return new Promise((resolve, reject)=>{
	   connection.connect((err) => {
		   if (err) {
			   reject(err);
		   } else {
			  resolve();
		   }
	   });
	}).then(()=>{
	   console.log('DB connection established');
	}).catch((err)=>{
	   console.log('Unable to connect to Db');
	   //console.log(err);
	})
}

//DISCONNECT FROM DB
async function disconnect(){
   return new Promise((resolve, reject)=>{
	  connection.end((err) => {
		  if (err) {
			  reject(err);
		  } else {
			 resolve();
		  }
	  });
   }).then(()=>{
	  console.log('DB connection ended gracefully');
   }).catch((err)=>{
	  console.log('Error ending Db connection');
	  //console.log(err);
   })
}



//EXECUTE QUERY (run this for selects and single insertions)
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
	}).then((rows) => {
		console.log('Query Executed successfully: '+SQLString);
		//console.log(`Data received from Db:`)
		//console.log(message);
		return rows;
	}).catch((message) => {
		console.log('Query Failed: '+ message)
		return false;		//	QUERY FAILED
	});
}


//EXECUTE TRANSACTION (run this for multiple insertions)
 async function transaction(queries) {
	return new Promise((resolve, reject) => {
		console.log("Beginning transaction...");
		connection.beginTransaction((err) => {
		if (err) {
			reject(err);
		} else {
			queries.forEach(async (e) => {		//LOOP THROUGH QUERIES
				status = await runQuery(e);
				if (!status ){
					reject()
				}else {
					if (queries.indexOf(e) == queries.length-1){	//IF WE ARE AT LAST QUERY, AND NO ERROR, RESOLVE.
						resolve();
					}
				}
			});
		}
		});
	}).then(()=> {					//ALL QUERIES RETURNED WITHOUT ERRORS
	connection.commit();
	console.log("Transaction commited successfully")
	return true;
	}).catch(()=>{			//A QUERY FAILED: ATTEMPT ROLLBACK CHANGES.
		console.log("Transaction failed, attempting to rollback changes... \n");
		connection.rollback((err) => {
			if (err){
				console.log("Rollback failed: "+err)
			} else {
				console.log("Rollback succeeded.")
			}
		});
		return false;
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
exports.addstylist=addstylist;
exports.createUser=createUser;
exports.searchByLocation =searchByLocation;
exports.searchStylists = searchStylists;
