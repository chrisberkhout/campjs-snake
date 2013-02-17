
var app = require('http').createServer(requestHandler),
io = require('socket.io').listen(app),
fs = require('fs'),
_ = require('underscore'),
map = new (require('./map.js'))(io),
Snake = require('./snake.js');

app.listen(8124);

function requestHandler(req, res) {
	console.log('starting');
	fs.readFile( __dirname + '/index.html', function (err, data) {

		if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		}
		res.writeHead(200); // sucess
		res.end(data); // Send data to user.

	});
};

map.startAutoMoving({
	afterEachMove: function() { io.sockets.emit('redraw', map.toString()) }
});

io.sockets.on('connection', function (socket) {

	socket.on('start', function(name){

		// Setup snake and attach to users scope through sockets.
		socket.snake = new Snake(name);
		map.placeSnake(socket.snake);

		map.placeFood();

		// Broadcast sends message to everyone but the current user.
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
			socket.snake.lastDirection = movement; // Remember last movement for automover
			map.moveSnake(socket.snake, movement);
		} else {
			console.log("movement triggered, but don't have stuff");
		};

		io.sockets.emit('redraw', map.toString());

	});

});
