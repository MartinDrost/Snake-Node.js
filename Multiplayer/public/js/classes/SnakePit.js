function SnakePit (canvas) 
{
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.mapWidth = 1000;
    this.mapHeight = 550;
    this.snakes = [];
    this.food = [];

    window.requestAnimationFrame(this.draw.bind(this));
}
 
SnakePit.prototype.addPlayer = function(name, color) {
	socket.emit("addPlayer", {name: name, color: color});
};
 
SnakePit.prototype.sendControlKey = function(key) {
	socket.emit("sendControl", {key: key});
};
 
SnakePit.prototype.draw = function() {
	//Reset canvas
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

	this.context.font = "10px Roboto";
	//Draw snakes
	for(var i = 0, l = this.snakes.length; i < l; i++)
	{
		var snake = this.snakes[i];

		this.context.fillStyle = snake.color;
		if(snake.state == State.dead)
			this.context.fillStyle = "#95a5a6";


		var textX = snake.segments[0].x - this.context.measureText(snake.name).width / 2 + 5,
			textY = snake.segments[0].y - 10;
		this.context.fillText(snake.name, textX, textY);

		for(var j = 0, m = snake.segments.length; j < m; j++)
		{
			var segment = snake.segments[j];
			this.context.fillRect(segment.x, segment.y, segment.width, segment.height);
		}
	}

	//Draw Food
	this.context.fillStyle = "#f1c618";
	for(var i = 0, l = this.food.length; i < l; i++)
	{
		var food = this.food[i];
		this.context.fillRect(food.x, food.y, food.width, food.height);
	}

	//Draw darker heads
	this.context.fillStyle = "rgba(0,0,0,0.2)";
	for(var i = 0, l = this.snakes.length; i < l; i++)
	{
		var snake = this.snakes[i],
			segment = snake.segments[0];

			this.context.fillRect(segment.x, segment.y, segment.width, segment.height);
	}

	var $this = this;
	setTimeout(function()
	{
		requestAnimationFrame($this.draw.bind($this))
	},16);
};