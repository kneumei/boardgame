define(['views/index', 'views/game'], 
	function(IndexView, GameView){
		var BoardgameRouter = Backbone.Router.extend({
			currentView: null,

			routes: {
				"index":"index",
				"newgame":"newgame",
				"joingame":"joingame"
			},

			changeView: function(view){
				if(null!=this.currentView){
					this.currentView.undelegateEvents();
				}
				this.currentView = view;
				this.currentView.render();
			},

			index: function(){
				this.changeView(new IndexView());
			},

			newgame: function(){
				this.changeView(new GameView())
			}, 

			joingame: function(){
				this.changeView(new GameView())
			}
		});

		return new BoardgameRouter();
	});