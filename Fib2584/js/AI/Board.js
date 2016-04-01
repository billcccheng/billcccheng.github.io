// convert from grid
function Board(grid) {

	this.SIZE = 4;
	this.values = [];
	this.build();

	// copy values from grid
	if(grid)
	{
		var pos = {x: 0, y: 0}; // to specify the position
		var tile;
		for(var i = 0; i < this.SIZE; i++)
		{
			for(var j = 0; j < this.SIZE; j++)
			{
				pos.x = j;
				pos.y = i;
				tile = grid.cellContent(pos);
				
				// assign value
				if(tile)
					this.values[i][j] = tile.index;
				else // null
					this.values[i][j] = 0;
			}
		}
	}
}

/* static member */

// Fibonacci mapping
var FIB = [ 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584,
			4181, 6765, 10946, 17711, 28657, 46368, 75025];

// build a 2D array with all 0
Board.prototype.build = function() {

	for(var i = 0; i < this.SIZE; i++)
	{
		var row = this.values[i] = [];

		for(var j = 0; j < this.SIZE; j++)
		{
			row.push(0);
		}
	}
};

Board.prototype.show = function() {

	var disp = "\n";

	for(var i = 0; i < this.SIZE; i++)
	{
		for(var j = 0; j < this.SIZE; j++)
		{
			disp += this.values[i][j] + " ";
		}

		disp += "\n";
	}

	console.log(disp);
};

// return a board copy
Board.prototype.copy = function() {

	var newBoard = new Board();
	for(var i = 0; i < this.SIZE; i++)
	{
		for(var j = 0; j < this.SIZE; j++)
		{
			newBoard.values[i][j] = this.values[i][j];
		}
	}

	return newBoard;
};

Board.prototype.flip = function() {

	var clone = this.copy();

	for(var i = 0; i < this.SIZE; i++)
	{
		for(var j = 0; j < this.SIZE; j++)
		{
			this.values[i][j] = clone.values[i][(4 - j) - 1];
		}
	}
};

Board.prototype.rotate = function() {

	var clone = this.copy();

	for(var i = 0; i < this.SIZE; i++)
	{
		for(var j = 0; j < this.SIZE; j++)
		{
			this.values[i][j] = clone.values[(4 - j) - 1][i];
		}
	}
};

// return true: all the same, illegal move
Board.prototype.compare = function(board) {

	for(var i = 0; i < this.SIZE; i++)
	{
		for(var j = 0; j < this.SIZE; j++)
		{
			if(this.values[i][j] != board.values[i][j])
				return false; // legal move
		}
	}

	return true; // illegal move
};

// move the board and return the score get
Board.prototype.move = function(direction) {

	var score;

	// up
	if(direction == 0)
	{
		score = this.moveUp();
	}

	// right
	else if(direction == 1)
	{
		this.rotate();
		this.rotate();
		this.rotate();
		score = this.moveUp();
		this.rotate();
	}

	// down
	else if(direction == 2)
	{
		this.rotate();
		this.rotate();
		score = this.moveUp();
		this.rotate();
		this.rotate();
	}

	// left
	else if(direction == 3)
	{
		this.rotate();
		score = this.moveUp();
		this.rotate();
		this.rotate();
		this.rotate();
	}

	else
	{
		console.log("ERROR: Invalid move.");
		score = 0;
	}

	return score;
};

// for this.move to call
Board.prototype.moveUp = function() {

	var score = 0;

	for(var j = 0; j < 4; j++) // column
	{
		var stop = 0; // stop index

		for(var i = 0; i < 4; i++) // row
		{
			if((i != 0) && (this.values[i][j] != 0)) // not first and not empty
			{
				// find target postion
				var targetPos = i; // if not modified, can't move
				for(var x = i - 1; x >= 0; x--)
				{
					// not empty
					if(this.values[x][j] != 0)
					{
						// can be merged
						if(((Math.abs(this.values[i][j] - this.values[x][j]) == 1)) 
							|| ((this.values[i][j] == 1) && (this.values[x][j] == 1)))
						{
							targetPos = x;
							break;
						}

						// can't be merged
						else
						{
							targetPos = x + 1; // last scanned one
							break;
						}
					}

					// empty
					else
					{
						// slide
						targetPos = x;

						// stop here
						if(x == stop)
							break;
					}
				}

				// need to move or merge
				if(i != targetPos)
				{
					// pick the bigger tile
					var big, small;
					if(this.values[targetPos][j] > this.values[i][j])
					{
						big = this.values[targetPos][j];
						small = this.values[i][j];
					}
					else
					{
						big = this.values[i][j];
						small = this.values[targetPos][j];
					}

					// new index not empty, add merge score
					if(this.values[targetPos][j] != 0)
					{
						score += FIB[big + 1]; // add score
						stop = targetPos + 1; // set next index as stop index
					}

					// new tile
					if(small > 0) // merge
						this.values[targetPos][j] = big + 1;
					else // move
						this.values[targetPos][j] = big;

					// old tile
					this.values[i][j] = 0; // set original place empty
				}
			}
		}
	}

	return score;
};