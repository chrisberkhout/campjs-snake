var _ = require('underscore');

module.exports = function() {

	this.width = 80;
	this.height = 40;

  var that = this;
	this.terrain = function() {
    var result = [];
    for (i=0; i<that.height; i++) {
      var row = [];
      for (j=0; j<that.width; j++) {
        row[j] = ".";
      }
      result[i] = row;
    }
    return result;
  };

  this.snakes = [];

	this.placeSnake = function(snake) {
    this.snakes.push(snake);
		var x = parseInt(Math.random() * this.width);
		var y = parseInt(Math.random() * this.height);
		snake.setPos({x: x,y: y})
	};

	this.moveSnake = function(snake, movement) {
		x = snake.x + movement.x;
    if (x >= this.width) { x = 0; }
    if (x < 0) { x = this.width - 1; }

		y = snake.y + movement.y;
    if (y >= this.height) { y = 0; }
    if (y < 0) { y = this.height - 1; }

		snake.setPos({x: x, y: y});
	};

	this.toString = function() {
		var result = this.terrain();

    _(this.snakes).each(function(snake) {
      _(snake.positions).each(function(pos) {
        result[pos.y][pos.x] = snake.character;
      });
    });

    return _(result).map(function(row) {
			return row.join("") + "\n";
		}).join("");
	};

};

