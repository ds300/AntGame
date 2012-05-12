exports.test_only = exports.test_only || {};

// generates random worlds fit for contests
function generateRandomWorld() {
	// make blank grid
	var grid = [];
	grid[0] = [];
	grid[149] = [];
	for (var i = 0; i < 150; i++) {
		grid[0].push("#");
		grid[149].push("#");
	}
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
	// hills next
	do {
		if (!(safetyCounter--)) { return generateRandomWorld(); }
		randCol = Math.floor(Math.random() * 150);
		randRow = Math.floor(Math.random() * 150);
	} while (!_superimpose(grid, hillShape, randRow, randCol, "+"));

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

function _drawRandomRock(grid) {
	var shape = rockShapes[Math.floor(Math.random() * rockShapes.length)];
	var row, col;
	var paintDirection = Math.floor(Math.random() * 6);
	var lastTurn = -1;
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
	var paintOperations = 30 + Math.floor(Math.random() * 50);

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

	

	// now replace "t"s with "#"s.
	for (row = 0; row < 150; row++) {
		for (col = 0; col < 150; col++) {
			if (grid[row][col] === "t") {
				grid[row][col] = "#";
			}
		}
	}

	// all done.
}

function _superimpose(grid, shape, row, col, type) {
	var oddRow = row % 2 === 1;
	// check that there's enough room on the grid
	if (row < 0 || col < 0 ||
		150 - row < shape.length ||
		150 - col < shape[0].length ||
		!oddRow && col === 0) {
		return false;
	}

	// first check that we can superimpose
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