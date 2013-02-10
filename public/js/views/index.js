define(['BoardgameView','text!templates/index.html'],
	function(BoardgameView, indexTemplate){
		var indexView = BoardgameView.extend({
			el: $('#content'),
			render: function(){
				this.$el.html(indexTemplate);
			},

		});
		return indexView
	});