//PROPERTIES
const 	server		= require('./Backend/server.js')
const		network 	= require('./Backend/network.js')
const 	database  = require('./Backend/database.js')
var refreshing = false
//SERVER & SETUP
//TODO Move things from devDependencies into dependencies?
//TODO Remove node_modules from github
async function start() {
	await server.startServer();
	setupRefresh()
	// TODO set up review apps - these get created when you create a new pull request
	// TODO Test sending multiple requests at once to see if the server can handle it.

}

start();

function setupRefresh() {
	if (!refreshing) {
		setInterval(refresh, 300000); // every 5 minutes (300000)
		refreshing = true
	}
}

async function refresh() {
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

exports.start=start;
