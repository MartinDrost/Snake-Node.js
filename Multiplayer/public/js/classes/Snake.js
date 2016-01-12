function Snake (name, x, y, color) 
{
    this.name = name;
    this.score = 0;
    this.color = color;
    this.state = State.alive;
    this.segments = [new SnakeSegment(x, y, 20, 20)];
}
 
Snake.prototype.setDirection = function(direction) {
	var segment = this.segments[0];

	switch(direction)
	{
		case Direction.up:
			if(segment.direction != Direction.down)
				segment.direction = direction;
			break;
		case Direction.down:
			if(segment.direction != Direction.up)
				segment.direction = direction;
			break;
		case Direction.left:
			if(segment.direction != Direction.right)
				segment.direction = direction;
			break;
		case Direction.right:
			if(segment.direction != Direction.left)
				segment.direction = direction;
			break;
	}
};

Snake.prototype.addSegment = function()
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

Snake.prototype.addScore = function(score)
{
	this.score += score;
};