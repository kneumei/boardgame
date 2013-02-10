define(['router', 'gameboard'], function(router, gameboard){
	var initialize = function(){
		runApplication();
	};

	var runApplication = function(){
		gameboard.initialize();
		window.location.hash = 'index';
		Backbone.history.start();
	};
	return {
		initialize: initialize
	};
});