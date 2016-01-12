var snakeServer = new SnakeServer();
var snakePit;
$(document).ready(function()
{
	snakePit = new SnakePit(document.getElementById("snake-canvas"));
	snakeServer.addPlayer("hans");

	$(window).keydown(function(event)
	{
	    snakePit.sendControlKey(event.keyCode);
	});
});