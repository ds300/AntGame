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
		"here": function (ant) { return ant.cell; },
		"ahead": function (ant) { return ant.cell.adjacentCells[ant.dir]; },
		"leftahead": function (ant) {
			return ant.cell.adjacentCells[(ant.dir + 5) % 6];
		},
		"rightahead": function (ant) {
			return ant.cell.adjacentCells[(ant.dir + 1) % 6]; 
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
				ant.cell.addMarker(ant.color, state.marker);
				ant.state = state.st;
				markCallback && markCallback(ant.cell.row, ant.cell.col, ant.color, state.marker);
			};
		},
		"unmark": function (state) {
			return function (ant) {
				ant.cell.removeMarker(ant.color, state.marker);
				ant.state = state.st;
				unmarkCallback && unmarkCallback(ant.cell.row, ant.cell.col, ant.color, state.marker);
			};
		},
		"pickup": function (state) {
			return function (ant) {
				if (ant.cell.hasFood() && !ant.hasFood()) {
					ant.cell.removeFood();
					ant.food = 1;
					ant.state = state.st1;
					foodCallback && foodCallback(ant.cell.row, ant.cell.col, ant.cell.getFood());
				} else {
					ant.state = state.st2;
				}
			};
		},
		"drop": function (state) {
			return function (ant) {
				if (ant.food === 1) {
					ant.cell.depositFood();
					ant.food = 0;
					foodCallback && foodCallback(ant.cell.row, ant.cell.col, ant.cell.getFood());
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
			return function (ant) {
				ncell = ant.cell.adjacentCells[ant.dir];
				if (ncell.isAvailable()) {
					ant.cell.removeAnt();
					ncell.setAnt(ant);
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
