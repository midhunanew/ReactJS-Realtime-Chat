
/**
 * Module dependencies.
 */

var express = require('express'),
  socket = require('./routes/socket.js');

var app = module.exports = express.createServer();

// Hook Socket.io into Express
var io = require('socket.io').listen(app);

var router = require('./router');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Socket.io Communication

io.sockets.on('connection',socket);

io.sockets.on('connect', function(socket)
{
    socket.key = socket.remoteAddress + ":" + socket.remotePort;
    console.log("connect");
    console.log(socket.handshake.address);
    console.log(socket.remoteAddress);
    //clients[socket.key] = socket;

    socket.on('close', function()
    {
        delete clients[socket.key];
    });
});

io.on('send:message',function(socket){
    socket.key = socket.remoteAddress + ":" + socket.remotePort;
    console.log("connect");
    console.log(socket.handshake.address);
    console.log(socket.remoteAddress);
});

//For solr
router.route(app);

// Start server

app.listen(8547, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
