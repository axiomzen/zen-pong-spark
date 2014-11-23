var request = require('request');
var debounce = require('debounce');
spark = require('sparknode');
core = new spark.Core({
      accessToken: '0a4512d533829e87423e23d79d0bb7298f6347b7',
      id: '53ff70066667574853402067'
    });
io = require('socket.io');
var url = "http://zen-pong-api.herokuapp.com/score";

io = io.listen(9990);

io.configure(function() {
  io.set('log level', 2);
});

core.on('scored', feelerPressed);
core.on('ping', feelersPingReceived);


core.on('online', function() {
  feelersOnline();
  feelerStatus();
  feelersPingReceived();
});

function feelerPressed(data) {
  // request.put(url, function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //   console.log(body);
  //   }
  // });
  request.post(url, {json: {player:data.data}}, function(err,res){
    console.log(err, res);
  });
  console.log(data);
};

function feelersPingReceived() {
  io.sockets.emit('feelers.connect');
  debounceFeelers();
};

function feelerStatus(data) {
  var stats = {
    online: this.online
  };
  io.sockets.emit("stats", stats);
};

function feelersOnline() {
  io.sockets.emit('core.online');
};

var debounceFeelers = debounce(function() {
  io.sockets.emit('feelers.disconnect');
  debounceFeelers();
}, 5000 + 250);