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
	var randCol, randRow;
	// hills first
	do {
		randCol = Math.floor(Math.random() * 150);
		randRow = Math.floor(Math.random() * 150);
	} while (!_superimpose(grid, hillShape, randRow, randCol, "+"));

	do {
		randCol = Math.floor(Math.random() * 150);
		randRow = Math.floor(Math.random() * 150);
	} while (!_superimpose(grid, hillShape, randRow, randCol, "-"));
	
	// do some rocks yo


	// now chuck some food in
	for (var i = 0; i < 11; i++) {
		var foodi = Math.floor(Math.random() * 3);
		do {
			randCol = Math.floor(Math.random() * 150);
			randRow = Math.floor(Math.random() * 150);
		} while (!_superimpose(grid, foodShapes[foodi], randRow, randCol, "5"));
	}

}
exports.generateRandomWorld = generateRandomWorld;

function _superimpose(grid, shape, row, col, type) {
	var oddRow = row % 2;
	// check that there's enough room on the grid
	if (row + shape.length > 149 ||
		col + shape[0].length > 149 ||
		!oddRow && col === 0) {
		return false;
	}

	// first check that we can superimpose
	for (var r = 0; r < shape.length; r++) {
		for (var c = 0; c < shape[0].length; c++) {
			// adjust column according to odd/even rows
			var tmpc = c + (!oddRow && r % 2 === 1 ? -1 : 0);
			if (shape[r][tmpc] === ".") { continue; }
			if (grid[row + r][col + tmpc] !== ".") { return false; }
		}
	}
	// now superimpose
	for (var r = 0; r < shape.length; r++) {
		for (var c = 0; c < shape[0].length; c++) {
			// adjust column according to odd/even rows
			var tmpc = c + (!oddRow && r % 2 === 1 ? -1 : 0);
			if (shape[r][tmpc] === "O") {
				grid[row + r][col + tmpc] = type;
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