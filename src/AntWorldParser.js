exports.test_only = exports.test_only || {};

/** 
 * Parses ant world code and returns a grid. Throws an 
 * error if anything is amiss.
 * @param code the code to parse
 * @param contestRules (Optional) If given a truthy value,
 *        contest rules are enforced.
 */
function parseAntWorld(code, contestRules) {
	// replace windows and mac newlines with unix ones
	code = code.replace(/\r\n/g, "\n");
	code = code.replace(/\r/g, "\n");

	// split into lines
	var lines = code.split(/\n/g);
	// remove blank lines at the end
	while (lines[lines.length - 1].trim() === "") {
		lines.splice(lines.length - 1, 1);
	}
	var numLines = lines.length;

	// check we have enough lines
	if ((contestRules && numLines < 3 + 150) ||
		(!contestRules && numLines < 3 + 3)) {
		throw new Error("Too few lines");
	}

	// get grid dimensions
	var dimens = lines.splice(0, 2);
	var width = parseInt(dimens[0].trim(), 10);
	var height = parseInt(dimens[1].trim(), 10);

	// dimensions checks
	if (!width || !height) {
		throw new Error("Could not parse world dimensions");
	}
	if (contestRules && (width !== 150 || height !== 150)) {
		throw new Error("Contest grids must be 150x150");
	}

	if (height !== lines.length) {
		throw new Error("Grid height does not match specified value");
	}

	// parse lines inividually
	var grid = {cells: [], width: width, height: height};
	for (var i = 0; i < height; i++) {
		grid.cells.push(_parseGridLine(lines[i]));
	}

	// aight, so we've got a well-dimensioned grid
	// now do standard validity checks of grid contents
	if (!_isSurroundedByRock(grid)) {
		throw new Error("The ant world must be enclosed by rock.");
	}
	if (!_gridContains("+")) {
		throw new Error("The ant wold must contain at least one red hill");
	}
	if (!_gridContains("-")) {
		throw new Error("The ant wold must contain at least one black hill");
	}
	if (!_gridContains("f")) {
		throw new Error("The ant wold must contain at least one source of food");
	}

	if (contestRules) {
		// now check for any remaining contest rules
		
	}
	return grid;
}

exports.parseAntWorld = parseAntWorld;

function _parseGridLine(line, oddLine, supposedWidth) {
	if (oddLine) { // we're expecting a space at the start
		if (line.substr(0, 1) !== " ") {
			throw new Error("No space at start of odd line");
		}
		// remove leading space and check no other spaces exist
		line = line.substr(1);
		if (line.substr(0, 1) === " ") {
			throw new Error("Too much space at start of odd line");
		}
	} else {
		// even line so space is bad
		if (line.substr(0, 1) === " ") {
			throw new Error("Unexpected space at start of even line");
		}
	}

	// get individual chars as array. trim trailing whitespace
	var chars = line.trim().split(/ /g);
	var numChars = chars.length;
	// check for correct width
	if (numChars !== supposedWidth) {
		throw new Error("Grid width mismatch");
	}
	var cells = [];
	for (var i = 0; i < numChars; i++) {
		// check for illegal cell identifiers
		if (!chars[i].match(/[1-9\-.+#]/)) {
			throw new Error("Unrecognised cell identifier: " + chars[i]);
		}
		// append to cells list
		if (chars[i].match(/[1-9]/)) {
			// food so change type to "f" and put value in another property
			cells.push({type: "f", quantity: parseInt(chars[i], 10)});
		} else {
			cells.push({type: chars[i]});
		}
	}
	return cells;
}
exports.test_only._parseGridLine = _parseGridLine;

// checks that there are no gaps around the edges of the grid
function _isSurroundedByRock(grid) {
	// check top and bottom row
	for (var x = 0; x < grid.width; x++) {
		if (grid.cells[0][x].type !== "#" || 
			grid.cells[grid.height - 1][x].type !== "#") {
			return false;
		}
	}
	// check leftmost and rightmost columns
	for (var y = 0; y < grid.height; y++) {
		if (grid.cells[y][0].type !== "#" || 
			grid.cells[y][grid.width - 1].type !== "#") {
			return false;
		}
	}
	return true;
}
exports.test_only._isSurroundedByRock = _isSurroundedByRock;

// searches the grid for a specific cell type
function _gridContains(grid, targetType) {
	for (var x = 0; x < grid.width; x++) {
		for (var y = 0; y < grid.height; y++) {
			if (grid.cells[x][y].type === targetType) {
				return true;
			}
		}
	}
}
exports.test_only._gridContains = _gridContains;

function _getElements(grid, targetType) {
	var elements = [];
	var visitedCells = [];
	// todo
}