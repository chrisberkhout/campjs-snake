var _ = require('underscore');

module.exports = function(name) {

	this.name = name;
	this.character = this.name === null ? '#' : this.name[0];
  this.positions = [];
  this.head = function() { return _(this.positions).last(); };
  this.length = 1;
  this.lastDirection = {
    x: parseInt(Math.random() * 3) - 1,
    y: parseInt(Math.random() * 3) - 1
  };

	this.setPos = function(pos) {
		this.x = pos.x;
		this.y = pos.y;
    this.positions.push(pos);
    if (this.positions.length > this.length) { this.positions.shift(); }
	};

};

