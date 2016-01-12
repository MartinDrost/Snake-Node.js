var snakePit;
var socket = io.connect('/');

$(document).ready(function()
{
	snakePit = new SnakePit(document.getElementById("snake-canvas"));
	snakePit.addPlayer("Hans" + Math.random(), "#00FF00")
	$(window).keydown(function(event)
	{
	    snakePit.sendControlKey(event.keyCode);
	});
});

socket.on('onconnected', function( data ) {
	//Note that the data is the object we sent from the server, as is. So we can assume its id exists. 
	console.log( 'Connected successfully to the socket.io server. My server side ID is ' + data.id );
});

socket.on('update', function( data ) {
	snakePit.snakes = data.snakes;
	snakePit.food = data.food;
});