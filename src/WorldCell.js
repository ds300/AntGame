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
		}
	}

	/***** initialise cell vars *****/
	var ant = null,
		food = cell.quantity || 0,
		markers = {
			red: [],
			black: []
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
		if (markers.red.length > 0) {
			s += "red marks: ";
			for (var i=0; i < markers.red.length; i++) {
				s += markers.red[i];
			}
			s += "; ";
		}
		// black markers
		if (markers.black.length > 0) {
			s+="black marks: ";
			for(var i = 0; i < markers.black.length; i++) {
				s += markers.black[i];
			}
			s += "; ";
		}
		// finally the ant if there is one
		if (!!ant) { s += ant.toString(); }
		return s.trim();
	};

	var addMarker = function(color, num){
		if (markers[color].indexOf(num) === -1){
			markers[color].push(num);
			markers[color].sort();
		}
	};
	var hasMarker = function(color, num){
		if (typeof num === 'undefined'){
			return markers[color].length > 0;
		} else {
			return markers[color].indexOf(num) > -1;
		}
	};
	var removeMarker = function(color, num){
		var i = markers[color].indexOf(num);
		if (i > -1){
			markers[color].splice(i,1);
		}
	};
	var containsAntOfColor = function(color){
		return !!ant && ant.color === color;
	};
	var containsAntOfColorWithFood = function(color){
		return containsAntOfColor(color) && ant.hasFood();
	};
	var depositFood = function (num) {
		if (typeof num === 'undefined'){
			food++;
		} else {
			food+=num;
		}
	};
	var hasFood = function () { return food > 0; };
	var removeFood = function () {
		if (hasFood()) { food--; }
	};
	var isAvailable = function () { return !ant; };
	var moveAntHere = function (newAnt) {
		// not sure about these semantics
		var oldCell = newAnt.getCurrentCell();
		oldCell.removeAnt();
		setAnt(newAnt);
	};
	var removeAnt = function () { ant = null; };
	var setAnt = function (newAnt) {
		ant = newAnt;
		ant.row = row;
		ant.col = col;
	};
	var getAnt = function () { return ant; };
	var getFood = function () { return food; };

	return {
		row:row,
		col:col,
		type:type,
		getAnt: getAnt,
		toString:toString,
		addMarker : addMarker,
		hasMarker : hasMarker,
		removeMarker : removeMarker,
		containsAntOfColor : containsAntOfColor,
		containsAntOfColorWithFood : containsAntOfColorWithFood,
		depositFood : depositFood,
		hasFood : hasFood,
		getFood : getFood,
		removeFood : removeFood,
		isAvailable : isAvailable,
		moveAntHere : moveAntHere,
		removeAnt : removeAnt,
		setAnt : setAnt
	}
}