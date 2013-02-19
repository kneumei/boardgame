define([], function() {
	var BoardgameRouter = Backbone.Router.extend({
		currentView: null,

		routes: {
			"index": "index",
			"createGame": "createGame",
			"joinGame/:id": "joingame"
		},

		index: function() {
			Backbone.trigger('show-index-view');
		},

		joingame: function(id) {
			console.log(this)
			var model = new GameModel({id: id});
			console.log(model.status);
			
		}

	});

	return new BoardgameRouter();
});