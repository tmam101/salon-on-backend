//EXPERIMENTAL PROXY CONNECTION FOR DB SECURITY

var mysql = require('mysql2'),
    url = require('url'),
    SocksConnection = require('socksjs');

var remote_options = {
    host: process.env.HOSTNAME,
    port: 3306
};

var proxy = url.parse(process.env.QUOTAGUARDSTATIC_URL),
    auth = proxy.auth,
    username = auth.split(':')[0],
    pass = auth.split(':')[1];

var sock_options = {
    host: proxy.hostname,
    port: 1080,
    user: username,
    pass: pass
};

var sockConn = new SocksConnection(remote_options, sock_options);
var dbConnection = mysql.createConnection({
    user: process.env.DBUSER,
  	password: process.env.DBPASSWORD,
  	database: process.env.DATABASE,
    stream: sockConn
});
exports.dbConnection=dbConnection;