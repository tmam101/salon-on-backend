//MARK: PROPERTIES
const 	network			= require('./Backend/network.js')
var 		CronJob 		= require('cron').CronJob;
const 	database  	= require('./Backend/database.js')
const 	thisURL		= "salon-on-backend.herokuapp.com"

//MARK: SERVER & SETUP
async function start() {
	await network.startServer();
	// database.connect();
	setupRefresh();
	database.runExampleQueries();
	// await database.runExampleQueries();
	var distance = await database.distanceBetweenTwoPoints("700 Bolinwood Dr Chapel Hill NC", "209 South Rd Chapel Hill NC");
	console.log(distance)
	//TODO Test
	// TODO Consider CircleCI which is auto tests
	// TODO Figure out heroku local
	// TODO set up review apps - these get created when you create a new pull request
}

start();
//MARK: FUNCTIONS

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
