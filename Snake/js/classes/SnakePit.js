function SnakePit (canvas) 
{
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.mapWidth = 500;
    this.mapHeight = 500;
    this.snakes = [];
    this.food = [];

    var $this = this;
    setInterval(function()
	{
		$this.draw();
	}, 1000/60);
}
 
SnakePit.prototype.addPlayer = function(name) {
	snakeServer.addPlayer("name");
};
 
SnakePit.prototype.sendControlKey = function(key) {
	snakeServer.processControl(key);
};
 
SnakePit.prototype.draw = function() {
	//Reset canvas
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

	//Draw snakes
	for(var i = 0, l = this.snakes.length; i < l; i++)
	{
		var snake = this.snakes[i];
		this.context.fillStyle = snake.color;
		for(var j = 0, m = snake.segments.length; j < m; j++)
		{
			var segment = snake.segments[j];
			this.context.fillRect(segment.x+1, segment.y+1, segment.width-2, segment.height-2);
		}
	}

	//Draw Food
	this.context.fillStyle = "#f1c618";
	for(var i = 0, l = this.food.length; i < l; i++)
	{
		var food = this.food[i];
		this.context.fillRect(food.x+1, food.y+1, food.width-2, food.height-2);
	}

	//Draw dead heads
	this.context.fillStyle = "#FF0000";
	for(var i = 0, l = this.snakes.length; i < l; i++)
	{
		var snake = this.snakes[i],
			segment = snake.segments[0];

		if(snake.state == State.dead)
			this.context.fillRect(segment.x+1, segment.y+1, segment.width-2, segment.height-2);
	}
};