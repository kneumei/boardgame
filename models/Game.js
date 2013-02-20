module.exports = function() {

	var nextId = 0;
	var games = new Array();

	var createGame = function(gameType, playerAlias, sessionId, callback){
		var game = {
			id: nextId,
			gameType: gameType,
			player1:{
				alias: playerAlias,
				sessionId: sessionId
			},
			player2: {},
			status: 'WAITING'
		}
		games[nextId] = game
		nextId = nextId+1;
		callback(game);
	}

	var updateGame = function(id, newGameState, sessionId, callback){
		var game = games[id];
		if(game==null){
			callback(false);
			return;
		}
		if(game.status=='WAITING' && newGameState.status=='PLAYING'){
			game.player2 ={
				alias: newGameState.player2,
				sessionId: sessionId
			};
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