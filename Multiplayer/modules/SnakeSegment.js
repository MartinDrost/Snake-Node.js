var Direction = require("./Direction.js");

module.exports = function (x, y, width, height) 
{
	this.direction = Math.round(Math.random()*3)+1;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}