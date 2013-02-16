
var app = require('http').createServer(handler)
	, io = require('socket.io').listen(app)
	, fs = require('fs');
var _ = require('underscore');

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
	this.char = this.name === null ? '#' : this.name[0];

	this.move = function(pos) {
		this.x = pos.x;
		this.y = pos.y;
	};
};

function Map() {
	this.width = 80;
	this.height = 40;

	this.terrain = [];
	for (i=0; i<this.height; i++) {
		var row = [];
		for (j=0; j<this.width; j++) {
			row[j] = ".";
		}
		this.terrain[i] = row;
	}

	this.placeSnake = function(snake) {
		var x = parseInt(Math.random() * this.width);
		var y = parseInt(Math.random() * this.height);
		this.terrain[y][x] = "x"
	};

	this.toString = function() {
		return _(this.terrain).map(function(row) {
			return row.join("") + "\n";
		}).join("");
	};
};

var map = new Map();

// registering event
io.sockets.on('connection', function (socket) {
	socket.on('start', function(name){
		console.log('in start');

		// Setup snake and attach to users scope through sockets.
		socket.snake = new Snake(name);
		map.placeSnake(socket.snake);

		// Broadcast sends message to everyone but the new user.
		socket.broadcast.emit('announce', socket.snake.name + ' entered');
	});
	
	socket.on('say', function(key) {
		var movement = {
			'left': {x: -1, y: 0},
			'up':   {x: 0, y: -1},
			'right':{x: 1, y: 0},
			'down': {x: 0, y: 1}
		}[key];

		// Send shit to everyone but yourself.
		// socket.broadcast.emit('announce', 'This is a broadcast'); 

		// Move the snake with the keyboard
    map.placeSnake(this.snake);
    // map.placeSnake(socket.snake.char, movement);

    io.sockets.emit('move', movement, map.toString());

  });
});
