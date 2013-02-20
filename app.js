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

app.get('/games/:id', function(req, res) {
  Game.getGameById(req.params.id, function(game) {
    if(game == null) {
      res.send(404);
      return;
    }
    
    var game = {
      id: game.id,
      gameType: game.gameType,
      status: game.status,
      player1: game.player1.alias,
      player2: game.player2.alias
    };
    res.send(JSON.stringify(game));
  });
});

app.post('/games', function(req, res) {
  var gameType = req.param('gameType', null);
  if(gameType == null) {
    res.send(400);
    return;
  }
  var player1 = req.param('player1', null);
  if(player1 == null) {
    res.send(400);
    return;
  }
  Game.createGame(gameType, player1, req.session.id, function(game) {
    var obj = {
      id: game.id
    };
    res.send(JSON.stringify(obj));
  });
});

app.put('/games/:id', function(req, res) {

  var newGameState = {
    status: req.param('status', ''),
    player1: req.param('player1',''),
    player2: req.param('player2', '')
  }

  Game.updateGame(req.params.id, newGameState, req.session.id, function(error) {
    if(error) {
      res.send(400);
      return;
    }
    res.send(200);
    return;
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