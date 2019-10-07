//PROPERTIES
const 	network		= require('./Backend/network.js')
const 	database  	= require('./Backend/database.js')
const 	helperFunctions 	= require('./helperFunctions.js')
var 	CronJob 	= require('cron').CronJob;
const 	thisURL		= "salon-on-backend.herokuapp.com"

//SERVER & SETUP
async function start() {
	await network.startServer();
	setupRefresh();
	await database.connect();

	console.log(await database.getAllAmenities());

	// var distance = await helperFunctions.distanceBetweenTwoPoints("700 Bolinwood Dr Chapel Hill NC", "209 South Rd Chapel Hill NC");
	// console.log(distance)
	//TODO Test
	// TODO Consider CircleCI which is auto tests
	// TODO set up review apps - these get created when you create a new pull request
}

start();

// //Alternate refresh?
// setInterval(function() {
//     http.get("http://salon-on-backend.herokuapp.com");
// }, 300000); // every 5 minutes (300000)


//REFRESH
function setupRefresh() {
	var refreshJob = new CronJob('0 */2 * * * *', async function() {
		var  options, body;
		options = {
			hostname: thisURL,
			path: '/refresh',
			method: 'POST'
		};
		body = {
			"Refresh" : "Refresh"
		};
		network.post(options, body)
	}, null, true, 'America/New_York')
	refreshJob.start();
}
