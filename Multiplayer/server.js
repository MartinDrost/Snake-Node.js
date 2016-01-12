var app = require("express")(),
	http = require("http").Server(app),
	io = require("socket.io")(http),
	express = require("express"),
	gameport = process.env.PORT || 4004,
	UUID = require('node-uuid');

//modules
var SnakeServer = require('./modules/SnakeServer.js'),
	game = new SnakeServer();

//Define routing
app.use(express.static(__dirname + "/public"));
app.get("/", function(request, response)
{
	response.sendFile(__dirname + "/index.html");
});


setInterval(function()
{
	io.emit("update", {snakes: game.snakes, food: game.food});
}, 100);

io.on("connection", function(socket)
{
	socket.userId = UUID();

	console.log("New connection: " + socket.userId);
	socket.emit("connected", { id : socket.userId });

	socket.on("addPlayer", function(data)
	{
		if(socket.name || game.getSnakeByName(data.name))
			return;

		socket.name = data.name;
		socket.color = data.color;

		console.log("New snake: " + socket.name);
		game.addPlayer(socket.name, socket.color);
	});


	socket.on("sendControl", function(data)
	{
		game.processControl(data.key, socket.name);
	});


	socket.on("disconnect", function()
	{

		console.log(socket.name + " has disconnected.");
		
		game.removeSnakeByName(socket.name);
	});
});

http.listen(gameport, function()
{
	console.log("Listening on *: " + gameport);
});