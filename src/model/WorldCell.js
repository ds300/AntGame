function _returnFalse() { return false; }

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
	
	/**** public functions ****/
	
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

	var addMarker = function (color, num) {
		if (!markers[color][num]) {
			markers[color][num] = true;
			markerCounts[color]++;
		}
	};
	var hasMarker = function (color, num) {
		if (typeof num === 'undefined') {
			return markerCounts[color] > 0;
		} else {
			return markers[color][num];
		}
	};
	var removeMarker = function (color, num) {
		if (markers[color][num]) {
			markers[color][num] = false;
			markerCounts[color]--;
		}
	};
	var containsAntOfColor = function (color) {
		return !!ant && ant.color === color;
	};
	var containsAntOfColorWithFood = function (color) {
		return containsAntOfColor(color) && ant.hasFood();
	};
	var depositFood = function (num) {
		if (typeof num === 'undefined') {
			food++;
		} else {
			food += num;
		}
	};
	var hasFood = function () { return food > 0; };
	var removeFood = function () {
		if (hasFood()) { food--; }
	};
	var isAvailable = function () { return !ant; };
	var removeAnt = function () { ant = null; };
	var setAnt = function (newAnt) {
		ant = newAnt;
		ant.cell = this;
	};
	var getAnt = function () { return ant; };
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
