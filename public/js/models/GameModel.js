define(function(require){
	var Game = Backbone.Model.extend({
		urlRoot: '/games',
	});
	return Game;
});