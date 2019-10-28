//PROPERTIES
const 	server		= require('./Backend/server.js')
const		network 	= require('./Backend/network.js')
const 	database  = require('./Backend/database.js')

//SERVER & SETUP
async function start() {
	server.startServer();
	// await database.connect()

	// await database.disconnect();

	setInterval(refresh, 300000); // every 5 minutes (300000)

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
		hostname: process.env.THISURL,
		path: '/refresh',
		method: 'POST'
	};
	body = {
    "text" : "refresh"
  };
	network.post(options, body);
}
