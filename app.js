var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

app.use("/css",express.static(__dirname+'/css'));
app.use("/images",express.static(__dirname+'/images'));
app.use("/js",express.static(__dirname+'/js'));
app.use("/node_modules",express.static(__dirname+'/node_modules'));

app.get('/', function(req,res){
  res.sendfile(__dirname+'/game.htm');
});

io.set('polltimeout','3000');

var white=null;
var black=null;
io.sockets.on('connection', function (socket) {
  
  if(!black){
    if(!white){
    white=socket;
    console.log('white connected');
    }else{
    black=socket;
    console.log('black connected');
    }
  }

  socket.on('move', function (data) {
    if(socket===white && black!=null){
      black.emit('move',data);
      console.log('sending message to black');
    }
    if(socket==black && white!=null){
      white.emit('move',data);
      console.log('sending message to white');
    }
  });

});

server.listen(8080);
console.log('Express server started on port %s', 8080);


