var express = require('express');
var app = express();

app.use("/css",express.static(__dirname+'/css'));
app.use("/images",express.static(__dirname+'/images'));
app.use("/js",express.static(__dirname+'/js'));

app.get('/', function(req,res){
  res.sendfile(__dirname+'/default.htm');
});

app.listen(8080);
console.log('Express server started on port %s', 8080);
;

