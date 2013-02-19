module.exports = function() {

	var nextId = 0;
	var games = new Array();

	var createGame = function(gameType, player1, callback){
		var game = {
			id: nextId,
			gameType: gameType,
			player1: player1,
			player2: null,
			status: 'WAITING'
		}
		games[nextId] = game
		nextId = nextId+1;
		callback(game);
	}

	var updateGame = function(id, newGameState, player, callback){
		var game = games[id];
		if(game==null){
			callback(false);
			return;
		}
		if(game.status=='WAITING' && newGameState.status=='PLAYING'){
			game.player2 = player;
			game.status='PLAYING';
			callback(true);
			return;
		}
		callback(false);
	}

	var getGameById = function(id, callback){
		callback(games[id]);
	}

	return {
		createGame: createGame,
		getGameById: getGameById,
		updateGame: updateGame
	}

}