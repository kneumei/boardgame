define(['BoardgameView', 'text!templates/index.html', 'models/GameModel'], 
	function(BoardgameView, indexTemplate, GameModel) {
	var indexView = BoardgameView.extend({
		el: $('#content'),

		events: {
			"click #toggleCreateGame": "toggleCreateGame",
			"click #toggleJoinGame":"toggleJoinGame",
			"click #createGame": "createGame",
			"click #joinGame": "joinGame"
		},


		render: function() {
			this.$el.html(indexTemplate);
			$("#error").hide();
			$("#createGameSection").hide();
			$("#joinGameSection").hide();
		},

		toggleCreateGame: function(){
			$("#createGameSection").slideToggle();
			$("#joinGameSection").hide();
		},

		toggleJoinGame: function(){
			$("#joinGameSection").slideToggle();
			$("#createGameSection").hide();
		},


		createGame: function(){
			var self = this;
			var name = $("#name1").val();
			var model = new GameModel({gameType:'tic-tac-toe', player1:name});
			model.save({},{
				success: function(){
					self.gotoGame(model.id);
				}, 
				error: function(){
					$("#error").text('Cannot create game');
					$("#error").slideDown();
				}
			});

		},

		joinGame: function(){
			var gameId = $("#gameId").val();
			var name = $("#name2").val();
			var model = new GameModel({id:gameId, status:"PLAYING", player2:name});
			var self = this;
			model.save({},{
				success: function(){
					self.gotoGame(model.id);
				},
				error: function(){
					$("#error").text('Cannot join game');
					$("#error").slideDown();
				}
			})
			this.gotoGame(gameId);
		},

		gotoGame: function(id){
			var model = new GameModel({id:id});
			model.fetch({
				success: function(){
					Backbone.trigger('show-game-view', model);
				},
				error: function(){
					$("#error").text('Cannot join game');
					$("#error").slideDown();
				}
			});
		}

	});
	return indexView
});