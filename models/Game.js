module.exports = function() {

	var nextId = 0;
	var games = new Array();

	var createGame = function(gametype, callback){
		var game = {
			id: nextId,
			gametype: gametype
		}
		games[nextId] = game
		gametype = gametype+1;
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