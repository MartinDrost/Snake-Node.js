var app = require("express")(),
	http = require("http").Server(app),
	io = require("socket.io")(http),
	express = require("express"),
	gameport = process.env.PORT || 4004,
	UUID = require('node-uuid');

//modules
var SnakeServer = require('./modules/SnakeServer.js'),
	game = new SnakeServer(io),
	connected = 0;

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
		var name = data.name.substring(0,10);
		if(socket.name)
			return socket.emit("dialog", {message: "You have already registered a name."});
		if(!name)
			return socket.emit("dialog", {message: "You have to define a name."});
		if(game.getSnakeByName(name))
			return socket.emit("dialog", {message: "That name is already in use."});
		if(!data.color)
			return socket.emit("dialog", {message: "You have to define a color."});


		socket.name = name;
		socket.color = data.color;

		console.log("New snake: " + socket.name);
		game.addPlayer(socket.name, socket.color);

		connected++;
		io.emit("numberOfConnections", {connections: connected})
		io.emit("newChatMessage", {
			name: socket.name,
			color: socket.color, 
			message: "Has joined.",
			time: new Date()
		});
		socket.emit("joinedGame");
	});


	socket.on("sendControl", function(data)
	{
		game.processControl(data.key, socket.name);
	});


	socket.on("sendChatMessage", function(data)
	{
		if(!socket.name)
			return socket.emit("dialog", {message: "You need to join the game before you can send messages."});

		console.log("[Chat] " + socket.name + ": " + data.message);
		io.emit("newChatMessage", {
			name: socket.name,
			color: socket.color, 
			message: data.message,
			time: new Date()
		});
	});



	socket.on("disconnect", function()
	{
		if(socket.name)
			connected--;
		console.log(socket.name + " has disconnected.");
		io.emit("numberOfConnections", {connections: connected})
		game.removePlayerByName(socket.name);
		game.killSnakeByName(socket.name);
	});
});

http.listen(gameport, function()
{
	console.log("Listening on *: " + gameport);
});