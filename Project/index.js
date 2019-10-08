//PROPERTIES
const 	server		= require('./Backend/server.js')
const		network 	= require('./Backend/network.js')
const 	database  = require('./Backend/database.js')
const 	thisURL		= "salon-on-backend.herokuapp.com"

//SERVER & SETUP
async function start() {
	await server.startServer();
	//setupRefresh();
	await database.connect();

	//REFRESH -- CHANGE TO http://localhost:3000/refresh FOR LOCAL TESTING
	setInterval(function() {
		network.get("salon-on-thomas.herokuapp.com/refresh");
	}, 300000); // every 5 minutes (300000)

	//TODO Test
	// TODO Consider CircleCI which is auto tests
	// TODO set up review apps - these get created when you create a new pull request
}

start();
