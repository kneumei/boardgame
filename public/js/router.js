define(['views/index', 'views/tictactoe', 'models/GameModel'], 
	function(IndexView, TictactoeView, GameModel){
		var BoardgameRouter = Backbone.Router.extend({
			currentView: null,

			routes: {
				"index":"index",
				"newgame":"createGame",
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

			createGame: function(){

				var router = this;
				$.post('/games',{
					gametype: 'tic-tac-toe'
				}, function onSuccess(obj){
					var model = new Game({id:obj.id});
					router.changeView(new TictactoeView({model:model}));
				}, function onError(err){
					console.log(err);
				});
				
			}, 

			joingame: function(){
				this.changeView(new TictactoeView())
			}
		});

		return new BoardgameRouter();
	});