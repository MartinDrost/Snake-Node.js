var snakePit;
var socket = io.connect('/');
var compress = new Compress();

$(document).ready(function()
{
	$("#send-chat-message").on("click", sendChatMessage);
	$("#chat-input").on("keydown", chatKeyPressed);
	$("#join-game-button").on("click", joinGame);

	snakePit = new SnakePit(document.getElementById("snake-canvas"));
	$(window).keydown(sendControlKey);

	$('select').material_select();
});

socket.on('onconnected', function( data ) {
	//Note that the data is the object we sent from the server, as is. So we can assume its id exists. 
	console.log( 'Connected successfully to the socket.io server. My server side ID is ' + data.id );
});
socket.on('joinedGame', function( data ) {
	$(".login-container").remove();
});

socket.on('numberOfConnections', function( data ) {
	$("#online-players").html(data.connections);
});

socket.on('update', function( data ) {
	var gameState = compress.decodeGameState(data);
	snakePit.snakes = gameState.snakes;
	snakePit.food = gameState.food;
});

socket.on('dialog', function( data ) {
	 Materialize.toast(data.message, 4000);
});

socket.on('newChatMessage', function( data ) {
	var html = "\
		<div class='chat-message flex'>\
			<div class='message-color' style='background-color:" + data.color + "'>\
			</div>\
			<div class='message-content'>\
				<div class='message-details'>\
					<strong>\
						" + data.name + "\
					</strong>\
					<span class='message-time'>\
						" + getFullTime(data.time) + "\
					</span>\
				</div>\
				<div class='message-text'>\
					" + data.message + "\
				</div>\
			</div>\
		</div>";

	var $container = $(".chat-messages");
	$container.append(html);
	$container.scrollTop($container[0].scrollHeight, 0);
});

function getFullTime(date)
{
	var date =  new Date(date),
		hours = date.getHours(),
		minutes = date.getMinutes();

	if(hours < 10)
		hours = "0" + hours;
	if(minutes < 10)
		minutes = "0" + minutes;

	return hours + ":" + minutes;
}


function chatKeyPressed(e)
{
	//Send message if enter is pressed
	if(e.keyCode == 13)
		sendChatMessage();
}

function sendChatMessage()
{
	var $input = $("#chat-input"),
		message = $input.val();

	$input.val("");

	socket.emit("sendChatMessage", {message: message});
}

function sendControlKey(event)
{
    snakePit.sendControlKey(event.keyCode);
}

function joinGame()
{
	var name = $("#player-name-input").val(),
		color = $("#player-color-input").val();

	snakePit.addPlayer(name, color);
}