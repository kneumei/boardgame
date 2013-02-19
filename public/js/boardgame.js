define(['router', 'gameboard', 'views/index','views/tictactoe', 'models/GameModel'], function(router, gameboard, IndexView, TictactoeView, GameModel) {
	var MainApp = Backbone.View.extend({

			currentView: null,
			
			initialize: function() {
				//this.router = options.router;

				// listen for events, either from the router or some view.
				this.listenTo(Backbone, 'show-index-view',this.showIndex);
				this.listenTo(Backbone, 'show-game-view', this.showGameView);

				gameboard.initialize();
			},

			changeView: function(view) {
				if(null != this.currentView) {
					this.currentView.undelegateEvents();
				}
				this.currentView = view;
				this.currentView.render();
			},

			showIndex: function() {
				this.changeView(new IndexView());
				router.navigate('index');
			},

			showGameView: function(model) {
				this.changeView(new TictactoeView({
					model: model
				}));
				router.navigate('games/' + model.id);
			}


		});
	return MainApp;
});