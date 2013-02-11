module.exports = function() {

	var nextId = 0;
	var games = new Array();

	var createGame = function(gameType, callback){
		var game = {
			id: nextId,
			gameType: gameType
		}
		games[nextId] = game
		nextId = nextId+1;
		callback(game);
	}

	var getGameById = function(id, callback){
		callback(games[id]);
	}

	return {
		createGame: createGame,
		getGameById: getGameById
	}

}