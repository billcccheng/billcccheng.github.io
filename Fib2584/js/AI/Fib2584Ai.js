function Fib2584Ai() {

	this.debugMode = false;

	// path of databases
	this._DB_4TUPLE_INSIDE_PATH = "js/AI/Database/DB_4-tuple_inside.tdl";
	this._DB_4TUPLE_OUTSIDE_PATH = "js/AI/Database/DB_4-tuple_outside.tdl";

	// tile-related constants
	this.NUM_DIRECTION = 4;
	this.TUPLE_SIZE = 4;
	this._MAX_TILE_LIMIT = 24; // the max possible tile
	this._TILE_KINDS = this._MAX_TILE_LIMIT + 1; // the amount of tile kinds (including 0)
	this._TILE_KINDS_2 = this._TILE_KINDS * this._TILE_KINDS; // square
	this._TILE_KINDS_3 = this._TILE_KINDS_2 * this._TILE_KINDS;
	this._TILE_KINDS_4 = this._TILE_KINDS_3 * this._TILE_KINDS;

	// databases
	this._DB_4TupleInside = new Array(this._TILE_KINDS_4);
	this._DB_4TupleOutside = new Array(this._TILE_KINDS_4);
}



/* Main functions */

Fib2584Ai.prototype.initialize = function() {

	// load the databases
	this.loadDatabase(this._DB_4TUPLE_INSIDE_PATH, this._DB_4TupleInside);
	this.loadDatabase(this._DB_4TUPLE_OUTSIDE_PATH, this._DB_4TupleOutside);
};

Fib2584Ai.prototype.generateMove = function(grid) {

	// convert the grid to board
	var board = new Board(grid);

	if(this.debugMode)
	{
		console.log("O:");
		board.show();
	}

	// create board for all directions
	var boards = new Array(this.NUM_DIRECTION);
	for(var i = 0; i < this.NUM_DIRECTION; i++)
		boards[i] = board.copy();

	// move boards and get the score
	var scores = new Array(this.NUM_DIRECTION);
	for(var i = 0; i < this.NUM_DIRECTION; i++)
	{
		scores[i] = boards[i].move(i);

		if(this.debugMode)
		{
			console.log(i + ":");
			boards[i].show();
		}
	}

	// compare the board to avoid illegal move
	var isLegalMoves = new Array(this.NUM_DIRECTION);
	for(var i = 0; i < this.NUM_DIRECTION; i++)
		isLegalMoves[i] = !board.compare(boards[i]);

	// evaluate with database, and plus the board values
	var values = new Array(this.NUM_DIRECTION);
	for(var i = 0; i < this.NUM_DIRECTION; i++)
		values[i] = this.evaluateBoard(boards[i]) + scores[i];

	// find the best move
	var move;
	var indexMax = -1; // no index 
	for(var i = 0; i < this.NUM_DIRECTION; i++)
	{
		if(indexMax == -1) // no index yet
		{
			if(isLegalMoves[i])
				indexMax = i;
		}
		else
		{
			if((values[i] > values[indexMax]) && isLegalMoves[i])
				indexMax = i;
		}
	}
	move = indexMax;

	if(this.debugMode)
	{
		console.log("Legal moves: " + isLegalMoves);
		console.log("Values: " + values);
		console.log("Move: " + move);
	}

	return move;
};



/* Database */

Fib2584Ai.prototype.loadDatabase = function(path, database) {

	var self = this;

	// load the content from file
	var words;
	var req = $.get(path, function(data) {
		words = data.split(/\s+/); // split by any kind of space
	}, 'text');

	req.fail(function() {
		console.log("ERROR: Can't load the file: " + path);
	});

	// as loading done, put the data to the database
	req.done(function() {

		// for all words in the file; ignore counter at the beginning
		var tuple = new Array(self.TUPLE_SIZE);
		var value;

		for(var i = 1; i < words.length; i += self.TUPLE_SIZE + 1)
		{	
			// assign to tuple
			for(var t = 0; t < self.TUPLE_SIZE; t++)
				tuple[t] = parseInt(words[i + t]);

			// set to database
			value = parseFloat(words[i + self.TUPLE_SIZE]);
			self.set4DArrayElem(database, tuple, value);
		}

		console.log("Initialized: " + path);
	});

};



/* Evaluation */

Fib2584Ai.prototype.evaluateBoard = function(board) {

	var value = 0;

	// copy a board
	var clone = board.copy();

	// flip 2, rotate 4
	for(var flipCtr = 0; flipCtr < 2; flipCtr++)
	{
		for(var rotCtr = 0; rotCtr < 4; rotCtr++)
		{
			// scan the upper two rows of board
			var row_out = new Array(4);
			var row_in = new Array(4);
			for(var i = 0; i < 4; i++)
			{
				row_out[i] = clone.values[0][i]; // first row (outside)
				row_in[i] = clone.values[1][i]; // second row (inside)
			}

			// look up database
			value += this.get4DArrayElem(this._DB_4TupleOutside, row_out);
			value += this.get4DArrayElem(this._DB_4TupleInside, row_in);

			// rotate
			clone.rotate();
		}

		// flip
		clone.flip();
	}

	return value;
};



/* Miscs */

Fib2584Ai.prototype.get4DArrayElem = function(database, tuple) {

	if(tuple.length == 4)
	{
		return database[tuple[0]*this._TILE_KINDS_3
						+ tuple[1]*this._TILE_KINDS_2
						+ tuple[2]*this._TILE_KINDS
						+ tuple[3]];
	}
	else
		console.log("ERROR: Invalid tuple.");
};

Fib2584Ai.prototype.set4DArrayElem = function(database, tuple, value) {

	if(tuple.length = 4)
	{
		database[tuple[0]*this._TILE_KINDS_3
				+ tuple[1]*this._TILE_KINDS_2
				+ tuple[2]*this._TILE_KINDS
				+ tuple[3]] = value;
	}
	else
		console.log("ERROR: Invalid tuple.");
};