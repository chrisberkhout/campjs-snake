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
		snake.setPos({x: x,y: y})
		this.terrain[snake.y][snake.x] = snake.character;
	};

	this.moveSnake = function(snake, movement) {
		x = snake.x + movement.x;
    if (x >= this.width) { x = 0; }
    if (x < 0) { x = this.width - 1; }

		y = snake.y + movement.y;
    if (y >= this.height) { y = 0; }
    if (y < 0) { y = this.height - 1; }

		snake.setPos({x: x, y: y});
		this.terrain[snake.y][snake.x] = snake.character;
	};

	this.toString = function() {
		return _(this.terrain).map(function(row) {
			return row.join("") + "\n";
		}).join("");
	};

};

