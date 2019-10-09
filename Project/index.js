//PROPERTIES
const 	server		= require('./Backend/server.js')
const		network 	= require('./Backend/network.js')
const 	database  = require('./Backend/database.js')
const 	thisURL		= "salon-on-backend.herokuapp.com"
const 	testURL 	= "salon-on-thomas.herokuapp.com"

//SERVER & SETUP
async function start() {
	await server.startServer();
	//setupRefresh();
	await database.connect();

	//REFRESH -- CHANGE TO http://localhost:3000/refresh FOR LOCAL TESTING
	setInterval(await refresh, 300000); // every 5 minutes (300000)

	//TODO Test
	// TODO Consider CircleCI which is auto tests
	// TODO set up review apps - these get created when you create a new pull request
	// TODO Test sending multiple requests at once to see if the server can handle it.
}

start();

async function refresh() {
	// Thomas: I was getting errors unless this is sent via post request in this manner.
	// If it worked for you Ethan, maybe we should talk about this.
	options = {
		hostname: testURL,
		path: '/refresh',
		method: 'POST'
	};
	body = {
    "text" : "refresh"
  };
	network.post(options, body);
}
