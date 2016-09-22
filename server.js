var express = require('express');
var morgan = require('morgan');
var http = require('http');
var path = require('path');
var jsonServer = require('json-server');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({

});


// CONFIGURE json middleware
var jsons = jsonServer.create();
jsons.use(jsonServer.defaults());
var jsonRouter = jsonServer.router('db.json');

// CONFIGURE Express App Server
var app = express();

app.use(morgan('dev'));
// add route for JSON stuff
app.use("/server/api", jsonRouter); // use json middleware in /api

// launch a HTTP server running express (which is configured
//	with the json-server middleware and static routes)
var server = http.createServer(app);
server.listen(3009, function() {
  console.log('Server started on port 3009');
});

