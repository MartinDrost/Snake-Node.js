var Direction = require("./Direction.js");

module.exports = function (x, y, width, height) 
{
	this.direction = Direction.none;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}