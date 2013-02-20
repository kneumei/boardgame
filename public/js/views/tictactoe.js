define(['BoardgameView', 'text!templates/game.html', 'Sockets'], function(BoardgameView, gameTemplate, sio) {

	var ticTacToeView = BoardgameView.extend({
		el: $('#content'),

		initialize: function() {
			this.model.bind('change', this.render, this);
		},
		
		render: function() {
			var data = {data:this.model.toJSON()};
			this.$el.html(_.template(gameTemplate, data ));
			var board = $("#board")[0]
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

			//var s = sio.connect();
		}
	});
	return ticTacToeView;
});