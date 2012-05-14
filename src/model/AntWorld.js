var WorldCell = WorldCell || function () {}; // to avoid lint errors

function AntWorld(parsedGrid) {
	var width = parsedGrid.width,
		height = parsedGrid.height;
	// build cells
	var grid = [];
	for (var row = 0; row < height; row++) {
		grid.push([]);
		for (var col = 0; col < width; col++) {
			grid[row].push(new WorldCell(parsedGrid.cells[row][col], row, col));
		}
	}

	function toString() {
		var s = "";
		for (var row = 0; row < height; row++) {
			for (var col = 0; col < width; col++) {
				s += "cell (" + col + ", " + row + "): " + 
				     grid[row][col].toString() + "\n";
			}
		}
		return s;
	}

	var adjacentGetters = [
		function (row, col) { return grid[row][col + 1]; },
		function (row, col) { return grid[row + 1][col + 1 * (row % 2)]; },
		function (row, col) { return grid[row + 1][col + 1 * ((row % 2) - 1)]; },
		function (row, col) { return grid[row][col - 1]; },
		function (row, col) { return grid[row - 1][col + 1 * ((row % 2) - 1)]; },
		function (row, col) { return grid[row - 1][col + 1 * (row % 2)]; }
	];
	
	function getAdjacentCell(row, col, dir) {
		return adjacentGetters[dir](row, col);
	}

	function getAllAdjacentCells(row, col) {
		var cells = [];
		for (var dir = 0; dir < 6; dir++) {
			cells.push(getAdjacentCell(row, col, dir));
		}
		return cells;
	}

	function getCell(row, col) {
		return grid[row][col];
	}
	return {
		width: width,
		height: height,
		getCell: getCell,
		getAllAdjacentCells: getAllAdjacentCells,
		getAdjacentCell: getAdjacentCell,
		toString: toString
	};
}
exports.AntWorld = AntWorld;
