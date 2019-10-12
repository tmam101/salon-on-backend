//PROPERTIES
const 	server		= require('./Backend/server.js')
const		network 	= require('./Backend/network.js')
const 	database  = require('./Backend/database.js')
const 	thisURL		= "salon-on-backend.herokuapp.com"
const 	testURL 	= "salon-on-thomas.herokuapp.com" //INSTEAD OF THIS, HOW ABOUT A HEROKU CONFIG VAR?/.ENV FOR LOCAL?

//SERVER & SETUP
function start() {
	server.startServer();
	//database.createUser("test@mail.com","bestpassword", "ethan", "bateman",false, false, null, null);
	database.addstylist("test@mail.com", "I chopa chopa yo face", [{id:5, price: 1.99, deposit:2.99, duration:1.30 }]);
	//database.disconnect();

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
		hostname: thisURL,
		path: '/refresh',
		method: 'POST'
	};
	body = {
    "text" : "refresh"
  };
	network.post(options, body);
}
