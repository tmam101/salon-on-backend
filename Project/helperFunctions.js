//We can store computational functions here, howevever we should probably try and impliment them
//on the client side (Java) if possible.

//vars
const network = require('./Backend/network.js')
const googleAPIKEY=process.env.GOOGLE_API_KEY;

//functions
async function distanceBetweenTwoPoints(origin, destination) {
	// TODO Consider the matrix since this is a 3 way transaction
	console.log("called distanceBetweenTwoPoints " + origin + " " + destination)
	origin.replace(" ", "+")
	origin.replace(",", "")
	destination.replace(" ", "+")
	destination.replace(",", "")
	const baseURL = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&"
	const parameters = "origins=" + origin + "&destinations=" + destination + "&key=" + googleAPIKEY
	const calculatedURL = baseURL + parameters
	var response = await network.get(calculatedURL)

	var distanceInMeters = response.rows[0].elements[0].distance.value
	var timeToTravel = response.rows[0].elements[0].duration.text // TODO This is so far unused
	// TODO We can also get these values in meters and seconds.
	return distanceInMeters
}

//exports
exports.distanceBetweenTwoPoints = distanceBetweenTwoPoints;
