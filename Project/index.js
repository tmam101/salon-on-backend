//PROPERTIES
const 	server		= require('./Backend/server.js')
const		network 	= require('./Backend/network.js')
const 	database  = require('./Backend/database.js')
//SERVER & SETUP
//TODO Move things from devDependencies into dependencies?
//TODO Remove node_modules from github
async function start() {
	await server.startServer();
	setInterval(refresh, 300000); // every 5 minutes (300000)
	// TODO set up review apps - these get created when you create a new pull request
	// TODO Test sending multiple requests at once to see if the server can handle it.
}

start();

async function refresh() {
	body = {
    "text" : "refresh"
  };
	await network.post(process.env.THISURL + '/refresh', body);
}
