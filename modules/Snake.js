var Controls = require("./Controls.js"),
	State = require("./State.js"),
	Direction = require("./Direction.js"),
	SnakeSegment = require("./SnakeSegment.js");

module.exports = function (name, x, y, color) 
{
    this.name = name;
    this.score = 0;
    this.color = color;
    this.state = State.alive;
    this.segments = [new SnakeSegment(x, y, 10, 10)];
    this.direction = Direction.none;
}
 
module.exports.prototype.setDirection = function(direction) {
	var segment = this.segments[0];

	switch(direction)
	{
		case Direction.up:
			if(segment.direction != Direction.down)
				this.direction = direction;
			break;
		case Direction.down:
			if(segment.direction != Direction.up)
				this.direction = direction;
			break;
		case Direction.left:
			if(segment.direction != Direction.right)
				this.direction = direction;
			break;
		case Direction.right:
			if(segment.direction != Direction.left)
				this.direction = direction;
			break;
	}
};

module.exports.prototype.addSegment = function()
{
	var lastSegment = this.segments[this.segments.length - 1],
		x = lastSegment.x,
		y = lastSegment.y;

	switch(lastSegment.direction)
	{
		case Direction.none:
			x += lastSegment.width;
			break;
		case Direction.up:
			y -= lastSegment.height;
			break;
		case Direction.down:
			y += lastSegment.height;
			break;
		case Direction.left:
			x += lastSegment.width;
			break;
		case Direction.right:
			x -= lastSegment.width;
			break;
	}

	this.segments.push(new SnakeSegment(x, y, lastSegment.width, lastSegment.height));
};

module.exports.prototype.addScore = function(score)
{
	this.score += score;
};