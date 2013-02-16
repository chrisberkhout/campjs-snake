var _ = require('underscore');

module.exports = function() {

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
		snake.move({x: x,y: y})
		this.terrain[snake.y][snake.x] = snake.character;
	};

	this.moveSnake = function(snake, movement) {
		x = snake.x + movement.x;
		y = snake.y + movement.y;
		snake.move({x: x, y: y});
		this.terrain[snake.y][snake.x] = snake.character;
	};

	this.toString = function() {
		return _(this.terrain).map(function(row) {
			return row.join("") + "\n";
		}).join("");
	};

};

