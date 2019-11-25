const mysql = require('mysql');
const sha1 = require('sha1');
var zipcodes = require('zipcodes');
const helperFunctions = require('../helperFunctions.js');

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

async function updatePassword(email, newPass) {
  let result = await runQuery(`UPDATE user SET hashword = '${sha1(newPass)}' WHERE email='${email}'`)
  // TODO handle bad results
  console.log(result)
}

async function addLocation(email, address, zip){
  let result = await runQuery(`INSERT INTO isLocated VALUES( '${email}', '${address}', ${zip}) ON DUPLICATE KEY UPDATE address = '${address}', zip = ${zip}`)
  if(result == false){
    return false;
  } else {
    return true;
  }
}


//MORE QUERY FUNCTIONS
async function searchStylists(term){
  let results = await runQuery(`SELECT * FROM user WHERE isStylist = true AND first like '%${term}%' OR last like '%${term}%'`)
  return JSON.stringify(results);
}
//GET STYLISTS WITH ZIPCODES IN RADIUS
async function searchStylistsByZip(zip, radius){
  console.log("Searching stylists by zipcode " + zip)
  zips = zipcodes.radius(zip, radius)
  //WILL ALWAYS RETURN AT LEAST USER ZIP
  query = `SELECT * FROM user U, isLocated L WHERE U.email = L.email AND U.isStylist=true AND (L.zip=${zips[0]}`

    //IF THERE ARE MORE ZIPS:
    if (zips.length>1){
      for (let i=1; i< zips.length; i++){
        query+= ` OR L.zip =${zips[i]}`
      }
    }
    query+= `)`
    console.log(query)
    results = await runQuery(query);
    console.log(results)
    if (results.length==0 || results == false || results==undefined){
      console.log("No styists found near zipcode")
      return {error: "No stylists found"}
    }
    console.log(`Found ${results.length} stylists near zipcode`)
    return results
  }

  // RETURN MORE SPECIFIC LOCATION RESULTS, (PERFORMS GOOGLE API DISTANCE FUNCTION ON ZIP RESULTS)
  async function searchStylistsSpecificLocation(address, zip, radius){
    let batch = await searchStylistsByZip(zip, radius);
    const getDistances = async function(batch) {
        var results = []
        for(var i = 0; i < batch.length; i++) {
          const distance = await helperFunctions.distanceBetweenTwoPoints(address, batch[i].address)
          if (distance<radius){
            results.push(batch[i]);
          }
        }
        return results;
    }
    const results = await getDistances(batch)
    return {"profiles" :results};
  }

  async function getAmenityByID(id){
    let result = await runQuery(`SELECT * FROM amenities WHERE aid=${id}`);
    console.log("Got amenity from DB");
    return result[0];
  }
  async function getClientByID(email){
    let result = await runQuery(`SELECT * FROM user WHERE email ='${email}'`);
    console.log("Got client from DB");
    return result[0];
  }
  async function getClientByUserAndPass(user, pass){
    let result = await runQuery(`SELECT * FROM user WHERE email = '${user}' AND hashword = '${sha1(pass)}'`)
    if (result.length == 0){
      return {Error: "No user found"}
    }
    return result[0];
  }

  async function getClientAppointments(user){
    let results = await runQuery(`select client, stylist, salon, styleName, category, bookDate, bookTime, price,
    deposit, duration, clientConfirm, stylistConfirm, salonConfirm from offersStyle S, bookings B, hairstyles H
    WHERE B.offerID = S.offerID AND S.hid = H.hid AND client = '${user}';`);
    return {"bookings": results}
  }
  async function getStylistAppointments(user){
   let  results = await runQuery(`select client, stylist, salon, styleName, category, bookDate, bookTime, price,
    deposit, duration, clientConfirm, stylistConfirm, salonConfirm from offersStyle S, bookings B, hairstyles H
    WHERE B.offerID = S.offerID AND S.hid = H.hid AND stylist = '${user}';`);
    return {"bookings": results}
  }

  async function createBooking(user, offerID, date, time){
    let status = await runQuery(`INSERT INTO bookings VALUES(null,'${user}', '${offerID}', null, '${date}', '${time}', FALSE, FALSE, FALSE)`);
    if(!status){
      console.log("Error Unable to create booking")
      return false;
    } else {
      console.log("Booking created successfully");
      return true;
    }
  }
  
  async function deleteBooking(bid){
    let status = await runQuery(`DELETE FROM bookings WHERE bid = '${bid}'`);
    if (!status){
      console.log("Unable to remove booking");
      return false;
    } else  {
      console.log("Successfully removed booking");
      return true;
    }
  }

  async function addRating(stylist, client, clean, pro, friend, access, comment){
    let status = await runQuery(`INSERT INTO ratings VALUES('${stylist}', 
      '${client}', ${clean}, ${pro}, ${friend}, ${access}, '${comment}')`);
    if(status ==false){
      console,log("Unable to add rating")
      return false;
    } else {
      console.log("Successfully added rating")
      return true;
    }
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

  async function addStylist(email, stylistBio, styles){
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
      styleQueries.push(`INSERT INTO offersStyle VALUES (null,'${email}', ${e.id}, ${e.price}, ${e.deposit}, ${e.duration})`)
    });
    if (styleQueries.length>0){
      status = await transaction(styleQueries);
    if (!status){
      console.log("FAILED: unable to add hairstyles to stylist account")
      return false;
    }
    }
    console.log("Stylist account activated successfully")
    return true;
  }

  async function deleteStylistComponent(email){
    let status = await runQuery(`DELETE FROM offersStyle WHERE stylist = '${email}'`);
    if (status){
      await runQuery(`UPDATE user SET isStylist = false WHERE email = '${email}'`)
    }
  }

  async function updateProfilePhoto(email, photo){
    let status = await runQuery(`INSERT INTO profilePhotos VALUES( '${email}', '${photo}') ON DUPLICATE KEY UPDATE photo = '${photo}'`)
    if (status == false){
      return false;
    } else {
      return true;
    }
  }
  async function getProfilePhoto(email){
    let results = await runQuery(`select photo from profilePhotos where id = '${email}'`)
    return results[0].photo
  }


  //TODO: ADD SALON COMPONENT TO ACCOUNT.





  //******DATABASE CONNECTION AND RUN-QUERY FUNCTIONS *********/

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
  exports.transaction=transaction;
  exports.runQuery = runQuery;
  exports.getAllAmenities= getAllAmenities;
  exports.getAllClients=getAllClients;
  exports.getAllHairStyles=getAllHairStyles;
  exports.getAllStylists=getAllStylists;
  exports.getAmenityByID=getAmenityByID;
  exports.getClientByID=getClientByID;
  exports.getClientByUserAndPass=getClientByUserAndPass;
  exports.addStylist=addStylist;
  exports.createUser=createUser;
  exports.searchStylistsByZip =searchStylistsByZip;
  exports.searchStylists = searchStylists;
  exports.searchStylistsSpecificLocation = searchStylistsSpecificLocation;
  exports.createBooking = createBooking;
  exports.getStylistAppointments = getStylistAppointments;
  exports.getClientAppointments = getClientAppointments;
  exports.deleteStylistComponent = deleteStylistComponent;
  exports.deleteBooking = deleteBooking;
  exports.updatePassword = updatePassword;
  exports.updateProfilePhoto=updateProfilePhoto;
  exports.getProfilePhoto= getProfilePhoto;
  exports.addLocation = addLocation;
  exports.addRating = addRating;
