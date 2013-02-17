var _ = require('underscore');

module.exports = function(io) {

	this.randomPos = function() {
		return {
			x: parseInt(Math.random() * this.width),
			y: parseInt(Math.random() * this.height)
		};
	};

	this.width = 80;
	this.height = 40;

	var that = this; // that makes the current object accessible from an inner function
	this.terrain = function() {
		return _.range(that.height).map(function() {
			return _.range(that.width).map(function() { return "."; });
		});
	};

	this.snakes = [];
	this.food = [];

	this.placeSnake = function(snake) {
		this.snakes.push(snake);
		snake.setPos(this.randomPos());
	};

	this.moveSnake = function(snake, movement) {

		// Nice and simple edge wrapping
		x = snake.head().x + movement.x;
		if (x >= this.width) { x = 0; }
		if (x < 0) { x = this.width - 1; }

		y = snake.head().y + movement.y;
		if (y >= this.height) { y = 0; }
		if (y < 0) { y = this.height - 1; }

		// Create the next position for snake
		var newPos = {x: x, y: y};

		// Flattern all snake bits into a long array of hash coordinates
		snakeBits = _(this.snakes).chain().map(function(snake) {
			return snake.positions 
		}).flatten().value();

		// Check if we hit another snake
		_(snakeBits).each(function(bit) {
			if(_.isEqual(newPos, bit)){
				io.sockets.emit('announce', "You hit another snake!!!");		
			};
		});

		// Check if we ate any of the foods		
		var that = this; // Java script scope hack.
		_(this.food).each(function(pos) {
			if(_.isEqual(newPos, pos)){
				// remove the correct food from the array
				that.food =  _.reject(that.food, function(f) { return _.isEqual(newPos, f); });
				snake.length++;   // Increase players snake
				that.placeFood(); // Place a new food item randomly on the map.
			};
		});
		
		snake.setPos(newPos);
	};

	this.placeFood = function() {
		this.food.push(this.randomPos());
	};

	this.toString = function() {
		var result = this.terrain();

		// Multi-food
		_(this.food).each(function(pos) {
			result[pos.y][pos.x] = '+';
		});

		// Render multiple snakes, one per person
		_(this.snakes).each(function(snake) {
			_(snake.positions).each(function(pos) {
				result[pos.y][pos.x] = snake.character;
			});
		});

		return _(result).map(function(row) {
			return row.join("") + "\n";
		}).join("");
	};

	this.startAutoMoving = function(opts) {
		var that = this;
		var interval = 300;
		var autoMover = function() {
			_(that.snakes).each(function(snake) {
				that.moveSnake(snake, snake.lastDirection)
			});
			opts.afterEachMove();
		};
		setInterval(autoMover, interval);
	};

};

