/**
 * AntWorld
 * This function returns an object which provides access to a hexagonal grid of
 * WorldCell objects.
 * @param parsedGrid A grid of objects representing the cells to be placed in
 *        the world. I.E. The result of a successful call to parseAntWorld.
 */
function AntWorld(parsedGrid) {
	// copy world dimensions
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

	/**
	 * Returns a string representation of the world
	 * @returns a string representation of the world
	 */
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

	// Each function in this list returns a cell adjacent to the one specified
	// by the (row, col) parameters. The index of the function in the array
	// determines the direction of the cell returned relative to the position
	// of the one at (row, col);
	var adjacentGetters = [
		function (row, col) { return grid[row][col + 1]; },
		function (row, col) { return grid[row + 1][col + 1 * (row % 2)]; },
		function (row, col) { return grid[row + 1][col + 1 * ((row % 2) - 1)]; },
		function (row, col) { return grid[row][col - 1]; },
		function (row, col) { return grid[row - 1][col + 1 * ((row % 2) - 1)]; },
		function (row, col) { return grid[row - 1][col + 1 * (row % 2)]; }
	];
	
	/**
	 * Returns the cell adjacent to the one at (row, col) in direction dir
	 * @param row The row of the base cell
	 * @param col The column of the base cell
	 * @param dir The direction in which the cell to be returned lies relative
	 *        to the base cell
	 * @returns the desired adjacent cell, or null if none exists.
	 */
	function getAdjacentCell(row, col, dir) {
		try {
			return adjacentGetters[dir](row, col);
		} catch (err) {
			return null;
		}
	}

	/**
	 * Returns all cells surrounding the one at (row, col)
	 * @param row The row of the base cell
	 * @param col The column of the base cell
	 * @returns a list of length 6, where the index represents the direction
	 *          in which the cell lies relative to the base cell. List elements
	 *          will be null if no cell lies in the relevant direction.
	 */
	function getAllAdjacentCells(row, col) {
		var cells = [];
		for (var dir = 0; dir < 6; dir++) {
			cells.push(getAdjacentCell(row, col, dir));
		}
		return cells;
	}

	/**
	 * Returns the cell at (row, col)
	 * @param row The row of the cell
	 * @param col The column of the cell
	 */
	function getCell(row, col) {
		return grid[row][col];
	}


	// cache adjacent cells
	for (var row = 0; row < height; row++) {
		for (var col = 0; col < width; col++) {
			grid[row][col].adjacentCells = getAllAdjacentCells(row, col);
		}
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
