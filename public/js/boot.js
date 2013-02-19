require.config({
  paths: {
    jQuery: '/js/libs/jquery',
    Underscore: '/js/libs/underscore',
    Backbone: '/js/libs/backbone',
    text: '/js/libs/text',
    templates: '../templates',
    Sockets: '/socket.io/socket.io'
  },

  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'Boardgame': ['Backbone']
  }
});

require(['Boardgame'], function(Boardgame) {
  window.location.hash = 'index';
  _.extend(Backbone, Backbone.Events)
  var bg = new Boardgame;
  Backbone.history.start();
});
