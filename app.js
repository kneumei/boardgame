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
    var color = null;
    if(req.session.id == game.player1) {
      color = "white";
    }
    if(req.session.id == game.player2) {
      color = "black"
    }
    var game = {
      id: game.id,
      gameType: game.gameType,
      status: game.status,
      color: color
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
  Game.createGame(gameType, req.session.id, function(game) {
    var obj = {
      id: game.id
    };
    res.send(JSON.stringify(obj));
  });
});

app.put('/games/:id', function(req, res) {

  var newGameState = {
    status : req.param('status','')
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