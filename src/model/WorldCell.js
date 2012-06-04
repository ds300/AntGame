/**
 * private function
 * @returns false
 */
function _returnFalse() { return false; }

/**
 * WorldCell
 * This funciton returns an object which represents a hexagonal cell in the ant
 * world.
 * @param cell A cell object from a parsed ant world (something like {type: "."})
 * @param row The row at which the cell will be found
 * @param col The column at which the cell will be found
 * @returns the WorldCell object.
 */
function WorldCell(cell, row, col) {
	// rocky cells have very limited functionality so make an exception here:
	if (cell.type === "#") {
		return {
			row: row,
			col: col,
			type: "rock",
			toString: function () { return "rock"; },
			// add marker can't be called
			hasMarker:  _returnFalse,
			// remove marker can't be called
			containsAntOfColor: _returnFalse,
			containsAntOfColorWithFood: _returnFalse,
			// depositFood can't be called
			hasFood: _returnFalse,
			// removefood can't be called
			isAvailable: _returnFalse,
			// move ant here can't be called
			// remove ant can't be called
			// set ant can't be called
			// get ant can't be called
			// get food can't be called
		};
	}

	/***** initialise cell vars *****/
	var ant = null,
		food = cell.quantity || 0,
		markers = {
			red: [false, false, false, false, false, false],
			black: [false, false, false, false, false, false]
		},
		markerCounts = {
			red: 0,
			black: 0
		};

	
	/***** update type *****/
	var type = cell.type === "+" ? "red hill"
			: cell.type === "-" ? "black hill"
			: "clear";
	
	/**
	 * @returns a string representation of the cell
	 */
	var toString = function () {
		var s = "";
		// food comes first
		if (food > 0) { s += food + " food; "; }
		// then color of hill if hill
		if (type !== "clear") { s += type + "; "; }
		// then red markers
		if (markerCounts.red > 0) {
			s += "red marks: ";
			for (var i = 0; i < markers.red.length; i++) {
				if (markers.red[i]) {
					s += i;
				}
			}
			s += "; ";
		}
		// black markers
		if (markerCounts.black > 0) {
			s += "black marks: ";
			for (var i = 0; i < markers.black.length; i++) {
				if (markers.black[i]) {
					s += i;
				}
			}
			s += "; ";
		}
		// finally the ant if there is one
		if (!!ant) { s += ant.toString(); }
		return s.trim();
	};

	/**
	 * add a marker to the cell
	 * @param color The color of the ant who placed the marker
	 * @param num The marker id
	 */
	var addMarker = function (color, num) {
		if (!markers[color][num]) {
			markers[color][num] = true;
			markerCounts[color]++;
		}
	};

	/**
	 * Checks whether a particular marker is in this cell
	 * @param color The color of the marker to check for
	 * @param num (optional) The marker id.
	 * @returns true if the specified marker is in the cell. If num is not
	 *          included, returns true if the cell contains any marker of the
	 *          specified color. False otherwise.
	 */
	var hasMarker = function (color, num) {
		if (typeof num === 'undefined') {
			return markerCounts[color] > 0;
		} else {
			return markers[color][num];
		}
	};

	/**
	 * removes a marker from this cell
	 * @param color The color of the marker to remove
	 * @param num The marker id.
	 */
	var removeMarker = function (color, num) {
		if (markers[color][num]) {
			markers[color][num] = false;
			markerCounts[color]--;
		}
	};

	/**
	 * checks whether this cell contains an ant of a particular color
	 * @param color The color to check for
	 * @returns true if the cell contains an ant of color color. false otherwise
	 */
	var containsAntOfColor = function (color) {
		return !!ant && ant.color === color;
	};

	/**
	 * checks whether this cell contains an ant of a parituclar color who is
	 * carrying food.
	 * @param color The color to check for
	 * @returns true if the cell contains an ant of color color carrying food. 
	 *          false otherwise
	 */
	var containsAntOfColorWithFood = function (color) {
		return containsAntOfColor(color) && ant.hasFood();
	};

	/**
	 * Puts some amount of food in this cell
	 * @param num The amount of food to put in this cell
	 */
	var depositFood = function (num) {
		if (typeof num === 'undefined') {
			food++;
		} else {
			food += num;
		}
	};

	/**
	 * checks whether this cell contains food
	 * @returns true if food, false otherwise
	 */
	var hasFood = function () { return food > 0; };

	/**
	 * removes one food particle from the cell, if there is any to remove
	 */
	var removeFood = function () {
		if (hasFood()) { food--; }
	};

	/**
	 * Checks whether this cell is available (i.e. there is no ant here)
	 * @returns true if no ant, false otherwise
	 */
	var isAvailable = function () { return !ant; };

	/**
	 * removes the ant from this cell
	 */
	var removeAnt = function () { ant = null; };

	/**
	 * sets an ant to be in this cell
	 * @param newAnt the ant to put in this cell
	 */
	var setAnt = function (newAnt) {
		ant = newAnt;
		ant.cell = this;
	};

	/**
	 * gets the ant currently in this cell
	 * @returns the ant currently in this cell
	 */
	var getAnt = function () { return ant; };

	/**
	 * gets the amount of food currently in this cell
	 * @returns the amount of food currently in this cell
	 */
	var getFood = function () { return food; };

	return {
		row: row,
		col: col,
		type: type,
		getAnt: getAnt,
		toString: toString,
		addMarker: addMarker,
		hasMarker: hasMarker,
		removeMarker: removeMarker,
		containsAntOfColor: containsAntOfColor,
		containsAntOfColorWithFood: containsAntOfColorWithFood,
		depositFood: depositFood,
		hasFood: hasFood,
		getFood: getFood,
		removeFood: removeFood,
		isAvailable: isAvailable,
		removeAnt: removeAnt,
		setAnt: setAnt
	};
}
exports.WorldCell = WorldCell;
