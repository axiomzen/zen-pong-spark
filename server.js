var request = require('request');
spark = require('sparknode');
core = new spark.Core(settings.sparkCore);
io = require('socket.io');


core.on('scored', feelerPressed);
core.on('ping', feelersPingReceived);


core.on('online', function() {
  feelersOnline();
  feelerStatus();
  feelersPingReceived();
});

feelerPressed = function(data) {
  request.put(ENDPOINT, {player:data.data})
};

feelersPingReceived = function() {
  io.sockets.emit('feelers.connect');
  debounceFeelers();
};

feelerStatus = function(data) {
  var stats = {
    online: this.online
  };
  io.sockets.emit("stats", stats);
};

feelersOnline = function() {
  io.sockets.emit('core.online');
};