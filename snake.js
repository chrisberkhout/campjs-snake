
var app = require('http').createServer(handler)
	, io = require('socket.io').listen(app)
	, fs = require('fs');

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
}

// registering event
io.sockets.on('connection', function (socket) {
	socket.on('start', function(player){
		console.log('in start');
		socket.player = player;
		socket.broadcast.emit('announce', player + ' entered');
	});
	
	socket.on('say', function(key) {
	   movement = {
		   'left': {x: -1, y: 0},
		   'up':   {x: 0, y: -1},
		   'right':{x: 1, y: 0},
		   'down': {x: 0, y: 1}
	   }[key]
	   
	   // Send shit to everyone but yourself.
       // socket.broadcast.emit('announce', 'This is a broadcast'); 

	   // Sends the data back to all clients connected.
       io.sockets.emit('move', movement);
   });
});
