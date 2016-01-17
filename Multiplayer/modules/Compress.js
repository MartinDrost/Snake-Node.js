module.exports = function () 
{
}

module.exports.prototype.encodeUint8 = function(number) 
{
	var arr = new Uint8Array( 1 );
	// If we assume that the number passed in
	// valid, we can just use it directly.
	// return String.fromCharCode( number );
	arr[0] = number;
	return String.fromCharCode( arr[0] );
};

module.exports.prototype.decodeUint8 = function( str, offset, obj, propName ) 
{
	obj[ propName ] = str.charCodeAt( offset );

	// Number of bytes (characters) read.
	return 1;
};

module.exports.prototype.encodeFloat32 = function(number) {
	var arr  = new Float32Array( 1 );
	var char = new Uint8Array( arr.buffer );
	arr[0] = number;
	// In production code, please pay
	// attention to endianness here.
	return String.fromCharCode( char[0], char[1], char[2], char[3] );
}

module.exports.prototype.decodeFloat32 = function( str, offset, obj, propName ) {
	var arr  = new Float32Array( 1 );
	var char = new Uint8Array( arr.buffer );
	// Again, pay attention to endianness
	// here in production code.
	for ( var i = 0; i < 4; ++i ) {
	  char[i] = str.charCodeAt( offset + i );
	}

	obj[ propName ] = arr[0];

	// Number of bytes (characters) read.
	return 4;
};

module.exports.prototype.encodeString = function(str) 
{
	return this.encodeUint8(str.length) + str;
}

module.exports.prototype.decodeString = function( str, offset, length, obj, propName ) 
{
	obj[propName] = str.substr(offset, length);

	return length;
}
 
module.exports.prototype.encodeGameState = function( state ) 
{
	var msg = '';

	msg += this.encodeUint8( state.snakes.length );
	for ( var i = 0, l = state.snakes.length; i < l; i++ ) {
		var snake = state.snakes[i];

		msg += this.encodeString( snake.name );
		msg += this.encodeString( snake.color );
		msg += this.encodeUint8( snake.score );
		msg += this.encodeUint8( snake.state );
		msg += this.encodeUint8( snake.segments.length );
		for(var j = 0; j < snake.segments.length; j++)
		{
			var segment = snake.segments[j];
			msg += this.encodeUint8( segment.direction );
			msg += this.encodeUint8( segment.x );
			msg += this.encodeUint8( segment.y );
			msg += this.encodeUint8( segment.width );
			msg += this.encodeUint8( segment.height );
		}
	}

	msg += this.encodeUint8( state.food.length );
	for ( var i = 0, l = state.food.length; i < l; i++ ) {
		var food = state.food[i];

		msg += this.encodeUint8( food.x );
		msg += this.encodeUint8( food.y );
		msg += this.encodeUint8( food.width );
		msg += this.encodeUint8( food.height );
	}


	return msg;
};
 
module.exports.prototype.decodeGameState = function( str ) 
{
	var charsRead = 0;

	var state = {
		snakes: [],
		food: []
	},
	lengths = {};

	while ( charsRead < str.length ) {


		charsRead += this.decodeUint8( str, charsRead, lengths, 'snakes' );

		for(var i = 0; i < lengths.snakes; i++)
		{
			var snake = { 
				segments: []
			};
			charsRead += this.decodeUint8( str, charsRead, lengths, 'string' );
			charsRead += this.decodeString( str, charsRead, lengths.string, snake, 'name' );
			charsRead += this.decodeUint8( str, charsRead, lengths, 'string' );
			charsRead += this.decodeString( str, charsRead, lengths.string, snake, 'color' );

			charsRead += this.decodeUint8( str, charsRead, snake, 'score' );
			charsRead += this.decodeUint8( str, charsRead, snake, 'state' );
			charsRead += this.decodeUint8( str, charsRead, lengths, 'segments' );
			for(var j = 0; j < lengths.segments; j++)
			{
				var segment = {};
				charsRead += this.decodeUint8( str, charsRead, segment, 'direction' );
				charsRead += this.decodeUint8( str, charsRead, segment, 'x' );
				charsRead += this.decodeUint8( str, charsRead, segment, 'y' );
				charsRead += this.decodeUint8( str, charsRead, segment, 'width' );
				charsRead += this.decodeUint8( str, charsRead, segment, 'height' );

				snake.segments.push(segment);
			}
			state.snakes.push(snake);
		}

		charsRead += this.decodeUint8( str, charsRead, lengths, 'food' );
		
		for(var i = 0; i < lengths.food; i++)
		{
			var food = {};
			charsRead += this.decodeUint8( str, charsRead, food, 'x' );
			charsRead += this.decodeUint8( str, charsRead, food, 'y' );
			charsRead += this.decodeUint8( str, charsRead, food, 'width' );
			charsRead += this.decodeUint8( str, charsRead, food, 'height' );

			state.food.push(food);
		}
	}

	return state;
};

