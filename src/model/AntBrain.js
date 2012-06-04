function AntBrain(states, color, rng, foodCallback, markCallback, unmarkCallback) {
	var otherColor = color === "red" ? "black" : "red";
	var senseConditionEvaluators = {
		"friend": function (senseCell) {
			return senseCell.containsAntOfColor(color); 
		},
		"foe": function (senseCell) {
			return senseCell.containsAntOfColor(otherColor); 
		},
		"friendwithfood": function (senseCell) {
			return senseCell.containsAntOfColorWithFood(color); 
		},
		"foewithfood": function (senseCell) {
			return senseCell.containsAntOfColorWithFood(otherColor); 
		},
		"food": function (senseCell) {
			return senseCell.hasFood(); 
		},
		"rock": function (senseCell) {
			return senseCell.type === "rock"; 
		},
		"marker": function (senseCell, marker) {
			return senseCell.hasMarker(color, marker); 
		},
		"foemarker": function (senseCell) {
			return senseCell.hasMarker(otherColor);
		},
		"home": function (senseCell) {
			return senseCell.type === color + " hill"; 
		},
		"foehome": function (senseCell) {
			return senseCell.type === otherColor + " hill"; 
		}
	};

	var senseCellFinders = {
		"here": function (ant) { return ant.getCurrentCell(); },
		"ahead": function (ant) { return ant.getAdjacentCell(ant.dir); },
		"leftahead": function (ant) {
			return ant.getAdjacentCell((ant.dir + 5) % 6); 
		},
		"rightahead": function (ant) {
			return ant.getAdjacentCell((ant.dir + 1) % 6); 
		}
	};
	var instructions = {
		"sense": function (state) {
			var getSenseCell = senseCellFinders[state.dir];
			var senseSuccess = senseConditionEvaluators[state.condition];
			return function (ant) {
				if (senseSuccess(getSenseCell(ant), state.marker)) {
					ant.state = state.st1;
				} else {
					ant.state = state.st2;
				}
			};
		},
		"mark": function (state) {
			return function (ant) {
				ant.getCurrentCell().addMarker(ant.color, state.marker);
				ant.state = state.st;
				markCallback && markCallback(ant.row, ant.col, ant.color, state.marker);
			};
		},
		"unmark": function (state) {
			return function (ant) {
				ant.getCurrentCell().removeMarker(ant.color, state.marker);
				ant.state = state.st;
				unmarkCallback && unmarkCallback(ant.row, ant.col, ant.color, state.marker);
			};
		},
		"pickup": function (state) {
			var cell;
			return function (ant) {
				cell = ant.getCurrentCell();
				if (cell.hasFood() && !ant.hasFood()) {
					cell.removeFood();
					ant.food = 1;
					ant.state = state.st1;
					foodCallback && foodCallback(cell.row, cell.col, cell.getFood());
				} else {
					ant.state = state.st2;
				}
			};
		},
		"drop": function (state) {
			var cell;
			return function (ant) {
				if (ant.food === 1) {
					cell = ant.getCurrentCell();
					cell.depositFood();
					ant.food = 0;
					foodCallback && foodCallback(cell.row, cell.col, cell.getFood());
				}
				ant.state = state.st;
			};
		},
		"turn": function (state) {
			var turnAnt;
			if (state.dir === "left") {
				turnAnt = function (ant) { ant.dir = (ant.dir + 5) % 6; };
			} else {
				turnAnt = function (ant) { ant.dir = (ant.dir + 1) % 6; };
			}
			return function (ant) {
				turnAnt(ant);
				ant.state = state.st;
			};
		},
		"move": function (state) {
			var ncell;
			var ccell;
			return function (ant) {
				ccell = ant.getCurrentCell();
				ncell = ant.getAdjacentCell(ant.dir);
				if (ncell.isAvailable()) {
					ncell.setAnt(ant);
					ccell.removeAnt();
					ant.state = state.st1;
					ant.rest();
					ant.checkForAdjacentDeaths();
				} else {
					ant.state = state.st2;
				}
			};
		},
		"flip": function (state) {
			return function (ant) {
				if (rng.next(state.p) === 0) {
					ant.state = state.st1;
				} else {
					ant.state = state.st2;
				}
			};
		}
	};

	var brain = [];
	for (var i = 0; i < states.length; i++) {
		brain.push(instructions[states[i].type](states[i]));
	}
	return brain;
}

exports.AntBrain = AntBrain;
