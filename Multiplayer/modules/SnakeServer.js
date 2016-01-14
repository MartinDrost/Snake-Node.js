var Controls = require("./Controls.js"),
	State = require("./State.js"),
	Direction = require("./Direction.js"),
	Food = require("./Food.js"),
	Snake = require("./Snake.js"),
	SnakeSegment = require("./SnakeSegment.js");

module.exports = function () 
{
    this.mapWidth = 500;
    this.mapHeight = 500;
    this.snakes = [];
    this.food = [];

    this.addFood();

    var $this = this;
    setInterval(function()
	{
		$this.update();
	}, 100);
}
 
module.exports.prototype.addPlayer = function(name, color) {
	var spawnPoint = this.getSpawnPoint();

	this.snakes.push(new Snake(name, spawnPoint[0], spawnPoint[1], color));
};
 
module.exports.prototype.addFood = function() {
	var spawnPoint = this.getSpawnPoint();

	this.food.push(new Food(spawnPoint[0], spawnPoint[1], 10, 10));
};
 
module.exports.prototype.processControl = function(key, name) {
	var snake = this.getSnakeByName(name);

	if(!snake || snake.state == State.dead)
		return;

	switch(key)
	{
		case Controls.up:
			snake.setDirection(Direction.up);
			break;
		case Controls.down:
			snake.setDirection(Direction.down);
			break;
		case Controls.left:
			snake.setDirection(Direction.left);
			break;
		case Controls.right:
			snake.setDirection(Direction.right);
			break;
		case Controls.space:
			snake.addSegment(); //DEBUG CODE
			break;
	}
};
 
module.exports.prototype.moveSnakes = function() {
	for(var i = 0, l = this.snakes.length; i < l; i++)
	{
		var snake = this.snakes[i];

		if(snake.segments[0].direction == Direction.none || snake.state == State.dead)
			continue;

		for(var j = snake.segments.length - 1; j >= 0; j--)
		{
			var segment = snake.segments[j],
				nextSegment  = snake.segments[j - 1];

			if(nextSegment)
			{
				segment.x = nextSegment.x;
				segment.y = nextSegment.y;
				segment.direction = nextSegment.direction;
			}
			else
			{
				switch(segment.direction)
				{
					case Direction.none:
						break;
					case Direction.up:
						segment.y -= segment.height;
						break;
					case Direction.down:
						segment.y += segment.height;
						break;
					case Direction.left:
						segment.x -= segment.width;
						break;
					case Direction.right:
						segment.x += segment.width;
						break;
				}
			}
		}
	};
};
 
module.exports.prototype.checkCollisions = function() {

	for(var snakeIndex = 0, snakeLength = this.snakes.length; snakeIndex < snakeLength; snakeIndex++)
	{
		var snake = this.snakes[snakeIndex],
			segment = snake.segments[0];

		//Check wall collisions
		if(segment.x < 0)
			segment.x = this.mapWidth - segment.width;
		if(segment.x >= this.mapWidth) 
			segment.x = 0;
		if(segment.y < 0) 
			segment.y = this.mapHeight - segment.height;
		if(segment.y >= this.mapHeight)
			segment.y = 0;



		//Check snake collissions
		for(var compSnakeIndex = 0; compSnakeIndex < snakeLength; compSnakeIndex++)
		{
			var compSnake = this.snakes[compSnakeIndex];
			for(var segmentIndex = 0, segmentLength = compSnake.segments.length; segmentIndex < segmentLength; segmentIndex++)
			{
				if(compSnake.name == snake.name && segmentIndex == 0)
					continue;

				var compSegment = compSnake.segments[segmentIndex];
				if(segment.x == compSegment.x && segment.y == compSegment.y)
				{
					snake.state = State.dead;
					break;
				}
			}
		}

		//Check food collisions
		for(var foodIndex = 0; foodIndex < this.food.length; foodIndex ++)
		{
			var food = this.food[foodIndex];
			
			if(segment.x == food.x && segment.y == food.y)
			{
				snake.addSegment();
				this.food.splice(foodIndex, 1);
				foodIndex--;
				this.addFood();
			}
		}
	}



};
 
module.exports.prototype.getSpawnPoint = function() {
	var points = [],
		distances = [],
		counter = 0;

	for(var y = 0, yLength = this.mapHeight; y < yLength; y += 10)
	{
		for(var x = 0, xLength = this.mapWidth; x < xLength; x += 10)
		{
			for(var snakeIndex = 0, snakeLength = this.snakes.length; snakeIndex < snakeLength; snakeIndex++)
			{
				var snake = this.snakes[snakeIndex];
				for(var segmentIndex = 0, segmentLength = snake.segments.length; segmentIndex < segmentLength; segmentIndex++)
				{
					var segment = snake.segments[segmentIndex],
						distance = Math.abs(segment.x - x) + Math.abs(segment.y - y);
					
					if(distances[counter] == undefined || distance < distances[counter])
						distances[counter] = distance;
				}
			}
			points[counter] = [x, y];
			counter++;
		}
	}

	var highestValue = 0,
		index = 0;
	for(var i = 0, l = distances.length; i < l; i++)
	{
		if(distances[i] > highestValue)
		{
			highestValue = distances[i];
			index = i;
		}
	}

	return points[index];
};

module.exports.prototype.update = function() {
	this.moveSnakes();
	this.checkCollisions();
};
 
module.exports.prototype.getSnakeByName = function(name) {
	var snake = null;
	for(var i = 0, l = this.snakes.length; i < l; i++)
	{
		var current = this.snakes[i];
		if(current.name == name)
		{
			snake = current;
			break;
		}
	}

	return snake;
};
 
module.exports.prototype.removeSnakeByName = function(name) {
	var snake = null;
	for(var i = 0, l = this.snakes.length; i < l; i++)
	{
		var current = this.snakes[i];
		if(current.name == name)
		{
			this.snakes.splice(i, 1);
			break;
		}
	}

	return snake;
};