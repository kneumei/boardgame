define(['views/index', 'views/tictactoe', 'models/GameModel'], function(IndexView, TictactoeView, GameModel) {
	var BoardgameRouter = Backbone.Router.extend({
		currentView: null,

		routes: {
			"index": "index",
			"newgame": "createGame",
			"joingame": "joingame"
		},

		changeView: function(view) {
			if(null != this.currentView) {
				this.currentView.undelegateEvents();
			}
			this.currentView = view;
			this.currentView.render();
		},

		index: function() {
			this.changeView(new IndexView());
		},

		createGame: function() {

			var router = this;
			$.post('/games', {
				gameType: 'tic-tac-toe'
			}, function(res) {
				var obj = JSON.parse(res);
				var model = new GameModel({id:obj.id});
				model.fetch({
					success: function(model, response){
						router.changeView(new TictactoeView({model:model}));
					}
				});
			}).error(function() {
				console.log("fail!");
			});

		},

		joingame: function() {
			this.changeView(new TictactoeView())
		}
	});

	return new BoardgameRouter();
});