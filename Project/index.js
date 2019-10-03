//MARK: PROPERTIES
const 	network			= require('./Backend/network.js')
var 		CronJob 		= require('cron').CronJob;
const 	database  	= require('./Backend/database.js')
const 	thisURL		= "salon-on-backend.herokuapp.com"

//MARK: SERVER & SETUP
async function start() {
	await network.startServer();
	database.connect();
	setupRefresh();
	// await database.runExampleQueries();
	// await database.distanceBetweenTwoPoints();
	await database.distanceBetweenTwoPoints
	//TODO Test
	// TODO Set up this code on github first, then create a new heroku project and connect it to that repo, then we can use github with it.
	// https://www.freecodecamp.org/news/how-to-deploy-a-nodejs-app-to-heroku-from-github-without-installing-heroku-on-your-machine-433bec770efe/
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
