exports.test_only = exports.test_only || {};

/**
 * Generates pseudo-random worlds in the form of source code
 * @returns the source code of a pseudo-random world which is contest legal
 */
function generateRandomWorld() {
	// make blank grid with rocks around the edges
	var grid = [];
	grid[0] = [];
	grid[149] = [];
	// do top and bottom rows first. full of them rocks!
	for (var i = 0; i < 150; i++) {
		grid[0].push("#");
		grid[149].push("#");
	}
	// now all the other rows
	for (var i = 1; i < 149; i++) {
		grid[i] = [];
		grid[i].push("#");
		for (var j = 1; j < 149; j++) {
			grid[i].push(".");
		}
		grid[i].push("#");
	}

	// that's the blank grid done, now to put stuff up in there!
	// rocks first
	for (var i = 0; i < 14; i++) {
		_drawRandomRock(grid);
	}

	var randCol, randRow;
	var safetyCounter = 10000;


	// the bits of code that look the bit below this do two things:
	//     1. Get some random coords
	//     2. Try to put something at those coords
	// They do this until they succeed, or until the safety counter gets to 0.
	// if that happens, a recursive call is made in the hopes that it won't 
	// happen again

	
	// red hill	
	do {
		if (!(safetyCounter--)) { return generateRandomWorld(); }
		randCol = Math.floor(Math.random() * 150);
		randRow = Math.floor(Math.random() * 150);
	} while (!_superimpose(grid, hillShape, randRow, randCol, "+"));

	// black hill
	do {
		if (!(safetyCounter--)) { return generateRandomWorld(); }
		randCol = Math.floor(Math.random() * 150);
		randRow = Math.floor(Math.random() * 150);
	} while (!_superimpose(grid, hillShape, randRow, randCol, "-"));


	// now chuck some food in
	for (var i = 0; i < 11; i++) {
		var foodi = Math.floor(Math.random() * 3);
		do {
			if (!(safetyCounter--)) { return generateRandomWorld(); }
			randCol = Math.floor(Math.random() * 150);
			randRow = Math.floor(Math.random() * 150);
		} while (!_superimpose(grid, foodShapes[foodi], randRow, randCol, "5"));
	}

	// concatenate into string
	var string = "150\n150\n";
	for (var row = 0; row < 150; row++) {
		string += (row % 2 === 0 ? "" : " ");
		string += grid[row].join(" ");
		string += "\n";
	}
	return string;
}
exports.generateRandomWorld = generateRandomWorld;

/**
 * private function
 * Draws a random rock shape onto the grid
 * @param grid The grid
 */
function _drawRandomRock(grid) {
	var shape = rockShapes[Math.floor(Math.random() * rockShapes.length)];
	var row, col;
	var paintDirection = Math.floor(Math.random() * 6);
	var paintOperations = 30 + Math.floor(Math.random() * 50);
	var lastTurn = -1;

	// chooses the next paint direction at random
	var setNextDirection = function () {
		// 10% chance of turning.
		if (Math.random() > 0.9) {
			// 90% chance of turning the same way as last time
			if (Math.random() > 0.9) {
				lastTurn = -lastTurn;
			}
			paintDirection += lastTurn;
			paintDirection = (paintDirection + 6) % 6;
		}
	};

	// moves the paintbrush in the current direction with respect to 
	// odd and even rows
	var moveToNextPosition = function () {
		if (paintDirection === 0 || paintDirection === 3) {
			col += paintDirection === 0 ? 1 : -1;
			return;
		}
		if ((paintDirection + 1) % 6 > 2) {
			// going left and up/down
			col += row % 2 === 0 ? -1 : 0;
		} else {
			// going right and up/down
			col += row % 2 === 0 ? 0 : 1;
		}
		row += paintDirection < 3 ? 1 : -1;
	};

	// find initial position
	do {
		col = Math.floor(Math.random() * 150);
		row = Math.floor(Math.random() * 150);
	} while (!_superimpose(grid, shape, row, col, "t"));

	// paint some rocks

	do {
		setNextDirection();
		moveToNextPosition();
	} while (_superimpose(grid, shape, row, col, "t") && --paintOperations);

	
	// we had to use "t" for "temp" instead of hashes when painting so...
	// replace "t"s with "#"s.
	for (row = 0; row < 150; row++) {
		for (col = 0; col < 150; col++) {
			if (grid[row][col] === "t") {
				grid[row][col] = "#";
			}
		}
	}

	// all done.
}

/**
 * private funciton
 * attempts to superimpose a shape onto the grid
 * @param grid The grid
 * @param shape The shape
 * @param row The row at which to position the top of the shape
 * @param col The column at which to position the left edge of the shape
 * @param type The type of cell to place if a superimposition is possible.
 *        Think of it like a color of paint.
 */
function _superimpose(grid, shape, row, col, type) {
	var oddRow = row % 2 === 1;
	// check that there's enough room on the grid
	if (row < 0 || col < 0 ||
		150 - row < shape.length ||
		150 - col < shape[0].length ||
		!oddRow && col === 0) {
		return false;
	}

	// check that there's nothing of import underneath
	for (var r = 0; r < shape.length; r++) {
		var d = ((r % 2 === 1) && !oddRow) ? -1 : 0;
		for (var c = 0; c < shape[0].length; c++) {
			// adjust column according to odd/even rows
			if (shape[r][c] === ".") { continue; }
			var cell = grid[row + r][col + c + d];
			if (cell !== "." && cell !== "t") { return false; }
		}
	}
	// now superimpose
	for (var r = 0; r < shape.length; r++) {
		var d = ((r % 2 === 1) && !oddRow) ? -1 : 0;
		for (var c = 0; c < shape[0].length; c++) {
			// adjust column according to odd/even rows
			if (shape[r][c] === "O") {
				grid[row + r][col + c + d] = type;
			}
		}
	}
	return true;
}
exports.test_only._superimpose = _superimpose;

// in the following shapes, the "*"s act as padding so that we don't get things
// next to each other that shouldn't be next to each other.

var hillShape = [
	[".", ".", ".", "*", "*", "*", "*", "*", "*", "*", "*", ".", ".", ".", "."],
	[".", ".", ".", "*", "O", "O", "O", "O", "O", "O", "O", "*", ".", ".", "."],
	[".", ".", "*", "O", "O", "O", "O", "O", "O", "O", "O", "*", ".", ".", "."],
	[".", ".", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", ".", "."],
	[".", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", ".", "."],
	[".", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", "."],
	["*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", "."],
	["*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*"],
	["*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", "."],
	[".", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", "."],
	[".", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", ".", "."],
	[".", ".", "*", "O", "O", "O", "O", "O", "O", "O", "O", "O", "*", ".", "."],
	[".", ".", "*", "O", "O", "O", "O", "O", "O", "O", "O", "*", ".", ".", "."],
	[".", ".", ".", "*", "O", "O", "O", "O", "O", "O", "O", "*", ".", ".", "."],
	[".", ".", ".", "*", "*", "*", "*", "*", "*", "*", "*", ".", ".", ".", "."]
]; // starts on odd line

var foodShapes = [];
foodShapes.push([
	[".", ".", "O", "O", "O", "O", "O"],
	[".", ".", "O", "O", "O", "O", "O"],
	[".", "O", "O", "O", "O", "O", "."],
	[".", "O", "O", "O", "O", "O", "."],
	["O", "O", "O", "O", "O", ".", "."]
]);

foodShapes.push([
	["O", "O", "O", "O", "O", ".", "."],
	[".", "O", "O", "O", "O", "O", "."],
	[".", "O", "O", "O", "O", "O", "."],
	[".", ".", "O", "O", "O", "O", "O"],
	[".", ".", "O", "O", "O", "O", "O"]
]);

foodShapes.push([
	[".", ".", "O", ".", "."],
	[".", ".", "O", "O", "."],
	[".", "O", "O", "O", "."],
	[".", "O", "O", "O", "O"],
	["O", "O", "O", "O", "O"],
	[".", "O", "O", "O", "O"],
	[".", "O", "O", "O", "."],
	[".", ".", "O", "O", "."],
	[".", ".", "O", ".", "."]
]);

var rockShapes = [];
rockShapes.push([
	[".", "+", "+", ".", "."],
	[".", "+", "O", "+", "."],
	["+", "O", "O", "+", "."],
	[".", "+", "+", "+", "."]
]);
rockShapes.push([
	[".", "+", "+", "+", "."],
	[".", "+", "O", "O", "+"],
	["+", "O", "O", "O", "+"],
	[".", "+", "O", "O", "+"],
	[".", "+", "+", "+", "."]
]);

rockShapes.push([
	[".", "+", "+", "+", "+", ".", "."],
	[".", "+", "O", "O", "O", "+", "."],
	["+", "O", "O", "O", "O", "+", "."],
	["+", "O", "O", "O", "O", "O", "+"],
	["+", "O", "O", "O", "O", "+", "."],
	[".", "+", "O", "O", "O", "+", "."],
	[".", "+", "+", "+", "+", ".", "."]
]);
