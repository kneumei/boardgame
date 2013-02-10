var express = require('express');
var http = require('http');
var MemoryStore = require('connect').session.MemoryStore;
var app = express();
var io = require('socket.io');
var utils = require('connect').utils;
var Session = require('connect').middleware.session.Session;
var Game = require('./models/Game')();

// Create an http server
app.server = http.createServer(app);

// Create a session store to share between methods
app.sessionStore = new MemoryStore();

app.configure(function() {
  app.sessionSecret = 'SocialNet secret key';
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
  app.use(express.limit('1mb'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: app.sessionSecret,
    key: 'express.sid',
    store: app.sessionStore
  }));
});


app.get('/', function(req, res) {
  res.render('index.jade');
});

app.post('/games', function(req,res){
  var gameType = req.param('gameType', '');
  if(gameType==null){
    res.send(400);
    return;
  }
  Game.createGame(req, function(game){
    res.send("{id:"+game.id+"}");
  });
});

var sio = io.listen(app.server);

sio.configure(function() {
  sio.sockets.on('connection', function(socket) {
    console.log("new connection!");
  });
});

app.server.listen(8080);
console.log('Listening on port 8080');