
var app = require('http').createServer(handler)
	, io = require('socket.io').listen(app)
	, fs = require('fs');
var _ = require('underscore');
var Map = require('./map.js');


var map = new Map();

app.listen(8124);

function handler (req, res) {
	console.log('starting');
	fs.readFile(__dirname + '/index.html',
				function (err, data) {
					if (err) {
						res.writeHead(500);
						return res.end('Error loading index.html');
					}
					res.writeHead(200); // sucess
					res.end(data); // Send data to user.
				});
};

function Snake(name) {
	this.name = name;
	this.character = this.name === null ? '#' : this.name[0];
  this.positions = [];
  this.head = function() { return _(this.positions).last(); };
  this.length = 5;

	this.setPos = function(pos) {
		this.x = pos.x;
		this.y = pos.y;
    this.positions.push(pos);
    if (this.positions.length > this.length) { this.positions.shift(); }
	};

};



// registering event
io.sockets.on('connection', function (socket) {
	socket.on('start', function(name){
		console.log('in start');

		// Setup snake and attach to users scope through sockets.
		socket.snake = new Snake(name);
		map.placeSnake(socket.snake);

    map.placeFood();

		// Broadcast sends message to everyone but the new user.
		socket.broadcast.emit('announce', socket.snake.name + ' entered');
	});
	
	socket.on('move', function(key) {
		var movement = {
			'left': {x: -1, y: 0},
			'up':   {x: 0, y: -1},
			'right':{x: 1, y: 0},
			'down': {x: 0, y: 1}
		}[key];

    if (socket.snake !== undefined && movement !== undefined) {
      map.moveSnake(socket.snake, movement);
    } else {
      console.log("movement triggered, but don't have stuff");
    };

    io.sockets.emit('move', movement, map.toString());

  });
});
