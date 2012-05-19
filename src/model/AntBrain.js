function AntBrain(states, color, rng) {
	var otherColor = color === "red" ? "black" : "red";
	var senseConditionEvaluators = {
		"Friend": function (senseCell) {
			return senseCell.containsAntOfColor(color); 
		},
		"Foe": function (senseCell) {
			return senseCell.containsAntOfColor(otherColor); 
		},
		"FriendWithFood": function (senseCell) {
			return senseCell.containsAntOfColorWithFood(color); 
		},
		"FoeWithFood": function (senseCell) {
			return senseCell.containsAntOfColorWithFood(otherColor); 
		},
		"Food": function (senseCell) {
			return senseCell.hasFood(); 
		},
		"Rock": function (senseCell) {
			return senseCell.type === "rock"; 
		},
		"Marker": function (senseCell, marker) {
			return senseCell.hasMarker(color, marker); 
		},
		"FoeMarker": function (senseCell) {
			return senseCell.hasMarker(otherColor);
		},
		"Home": function (senseCell) {
			return senseCell.type === color + " hill"; 
		},
		"FoeHome": function (senseCell) {
			return senseCell.type === otherColor + " hill"; 
		}
	};

	var senseCellFinders = {
		"Here": function (ant) { return ant.getCurrentCell(); },
		"Ahead": function (ant) { return ant.getAdjacentCell(ant.dir); },
		"LeftAhead": function (ant) {
			return ant.getAdjacentCell((ant.dir + 5) % 6); 
		},
		"RightAhead": function (ant) {
			return ant.getAdjacentCell((ant.dir + 1) % 6); 
		}
	};
	var instructions = {
		"Sense": function (state) {
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
		"Mark": function (state) {
			return function (ant) {
				ant.getCurrentCell().addMarker(ant.color, state.marker);
				ant.state = state.st;
			};
		},
		"Unmark": function (state) {
			return function (ant) {
				ant.getCurrentCell().removeMarker(ant.color, state.marker);
				ant.state = state.st;
			};
		},
		"PickUp": function (state) {
			return function (ant) {
				var cell = ant.getCurrentCell();
				if (cell.hasFood() && !ant.hasFood()) {
					cell.removeFood();
					ant.food = 1;
					ant.state = state.st1;
				} else {
					ant.state = state.st2;
				}
			};
		},
		"Drop": function (state) {
			return function (ant) {
				if (ant.food === 1) {
					ant.getCurrentCell().depositFood();
					ant.food = 0;
				}
				ant.state = state.st;
			};
		},
		"Turn": function (state) {
			var turnAnt;
			if (state.dir === "Left") {
				turnAnt = function (ant) { ant.dir = (ant.dir + 5) % 6; };
			} else {
				turnAnt = function (ant) { ant.dir = (ant.dir + 1) % 6; };
			}
			return function (ant) {
				turnAnt(ant);
				ant.state = state.st;
			};
		},
		"Move": function (state) {
			return function (ant) {
				var cell = ant.getAdjacentCell(ant.dir);
				if (cell.isAvailable()) {
					cell.moveAntHere(ant);
					ant.state = state.st1;
					ant.rest();
					ant.checkForAdjacentDeaths();
				} else {
					ant.state = state.st2;
				}
			};
		},
		"Flip": function (state) {
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
