define(["Sockets"], function(sio) {
	var GameSocket = function(model) {
		var socket = null;
		var connectSocket = function() {
			console.log("Connecting...")
			socket = sio.connect();

			socket.on('gamechange', function(){
				console.log("change! ");
				model.fetch();
			})
		}
		Backbone.on('game:joined', connectSocket);
	}

	return {
		initialize: function (model){
			GameSocket(model);
		}
	}

});