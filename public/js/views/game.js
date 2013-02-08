define(['BoardgameView', 'gameboard', 'text!templates/game.html', 'Sockets'], 
	function(BoardgameView, gameboard, gameTemplate, sio) {
	
	var gameView = BoardgameView.extend({
		el: $('#content'),
		render: function() {
			gameboard.initialize();
			this.$el.html(gameTemplate);
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

			var s = sio.connect();
		}
	});
	return gameView;
});