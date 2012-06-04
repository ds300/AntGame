/**
 * AntBrain
 * This function returns a numbered list of instruction functions which act 
 * upon an ant, causing it to do things.
 * @param states An object representing the various instructions to be 
 *        compiled.
 * @param color The color of the ant. Should be either red or black.
 * @param rng The pseudo-random number generator the ant should use to make 
 *        flip choices.
 * @param foodCallback (optional) The callback to execute when food is picked 
 *        up or dropped. Takes parameters (row, col, food)
 *        @param row The row of the cell concerned
 *        @param col The column of the cell concerned
 *        @param food The amount of food currently in the cell concerned
 * @param markCallback (optional) The callback to execute when a marker is 
 *        placed. Takes parameters (row, col, color, marker)
 *        @param row The row of the cell concerned
 *        @param col The column of the cell concerned
 *        @param color The color of the ant concerned
 *        @param marker The id of the marker placed
 * @param unmarkCallback (optional) The callback to execute when a marker is 
 *        removed. Takes parameters (row, col, color, marker)
 *        @param row The row of the cell concerned
 *        @param col The column of the cell concerned
 *        @param color The color of the ant concerned
 *        @param marker The id of the marker removed
 */
function AntBrain(states, color, rng, foodCallback, markCallback, unmarkCallback) {
	var otherColor = color === "red" ? "black" : "red";

	// These so-called "sense condition evaluators" are functions which take
	// a particular world cell as parameter and return true or false based
	// on whether that cell satisfies a particular condition. The conditions
	// are those available for use in the 'sense' instruction of the ant brain 
	// language
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

	// These so-called "sense cell finders" are functions which take as 
	// parameter the ant concerned, and return a nearby cell for use in
	// a sense condition evaluator. The cells returned are relative to the
	// ant's current position and are selected by the second "direction"
	// parameter in the 'sense' instruction of the ant brain language.
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

	// These so-called "instructions" are functions which return functions.
	// That might sound crazy to a java programmer. The functions they
	// return carry out the necessary actions upon an ant as specified by
	// the individual states in the source code of an ant brain. The 
	// functions take an state definition object as parameter, and the returned
	// functions take an ant as parameter.
	var instructions = {
		"sense": function (state) {
			var getSenseCell = senseCellFinders[state.dir];
			var senseSuccess = senseConditionEvaluators[state.condition];
			/**
			 * Abstract 'Sense' instruction
			 * if some condition is true in some cell, set the ant's state
			 * to st1, otherwise set it to st2
			 * @param ant The ant
			 */
			return function (ant) {
				if (senseSuccess(getSenseCell(ant), state.marker)) {
					ant.state = state.st1;
				} else {
					ant.state = state.st2;
				}
			};
		},
		"mark": function (state) {
			/**
			 * Abstract 'Mark' instruction
			 * Add a marker to the ant's current cell and go to st
			 * @param ant The ant
			 */
			return function (ant) {
				ant.cell.addMarker(ant.color, state.marker);
				ant.state = state.st;
				markCallback && markCallback(ant.cell.row, ant.cell.col, ant.color, state.marker);
			};
		},
		"unmark": function (state) {
			/**
			 * Abstract 'Unmark' instruction
			 * Remove a marker from the ant's current cell and go to st
			 * @param ant The ant
			 */
			return function (ant) {
				ant.cell.removeMarker(ant.color, state.marker);
				ant.state = state.st;
				unmarkCallback && unmarkCallback(ant.cell.row, ant.cell.col, ant.color, state.marker);
			};
		},
		"pickup": function (state) {
			/**
			 * Abstract 'PickUp' instruction
			 * If the ant can pick up food, make it pick up the food, and go to
			 * st1, otherwise go to st2
			 * @param ant The ant
			 */
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
			/**
			 * Abstract 'drop' instruction
			 * If the ant has food, drop it in it's current cell
			 * @param ant The ant
			 */
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
			/**
			 * Abstract 'turn' instruction
			 * Turn the ant and go to st
			 * @param ant The ant
			 */
			return function (ant) {
				turnAnt(ant);
				ant.state = state.st;
			};
		},
		"move": function (state) {
			var ncell;
			/**
			 * Abstract 'move' instruction
			 * If the can move, move it and go to st1, otherwise go to st2.
			 * @param ant The ant
			 */
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
			/**
			 * Abstract 'flip' instruction
			 * Get a random number < p. If it's 0, go to st1, otherwise go to
			 * st2
			 * @param ant The ant
			 */
			return function (ant) {
				if (rng.next(state.p) === 0) {
					ant.state = state.st1;
				} else {
					ant.state = state.st2;
				}
			};
		}
	};

	// construct list of instruction functions
	var brain = [];
	for (var i = 0; i < states.length; i++) {
		brain.push(instructions[states[i].type](states[i]));
	}
	return brain;
}

exports.AntBrain = AntBrain;
