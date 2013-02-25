define(['BoardgameView', 'text!templates/game.html'], function(BoardgameView, gameTemplate) {

	var ticTacToeView = BoardgameView.extend({
		el: $('#content'),

		initialize: function(options) {
			this.model.bind('change', this.renderModel, this);
			Backbone.trigger('game:joined');
			this.gameSocket = options.gameSocket
		},

		render: function() {
			this.renderModel();
			this.board = $("#board")[0]
			board.toBoard({
				cellWidth: 80,
				cellHeight: 80,
				columns: 3,
				rows: 3,
				showGridLines: true,
				gridLineColor: '#fff',
				backgroundColor: 'black',
				cellColor: 'yellow',
				alternateCellColor: 'lime',
				useAlgebraicNotation: true
			});

			board.onCellClick(function(e) {
				board.drawPiece(e.cell, 'images/home2.png');
			});
		},

		renderModel: function() {
			var data = {
				data: this.model.toJSON()
			};
			this.$el.html(_.template(gameTemplate, data));
			if(this.board != null) this.board.calculateOffset();

		}
	});
	return ticTacToeView;
});