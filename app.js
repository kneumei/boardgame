var express = require('express')
var app = express();
var MemoryStore = require('connect').session.MemoryStore;
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.configure(function(){
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
  app.use(express.limit('1mb'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: "secret key", store: new MemoryStore()}));
  });

app.get('/', function(req,res){
  res.render('index.jade');
});

io.sockets.on('connection', function(socket){
	socket.on('newgame', function(data){
		console.log("New Game! ");
	});
});

server.listen(8080);
console.log('Express server started on port %s', 8080);


