var Ant = Ant || function () {}; // to avoid lint errors
/**
 * AntGame objects represent a match between two ant brains on a specific
 * world.
 * @param redBrain the brain of the ants on the red team
 * @param blackBrain the brain of the ants on the black team
 * @param world the world in which the ants compete
 */
function AntGame(redBrain, blackBrain, world) {
	var red_hill_cells = [];
	var black_hill_cells = [];
	var ants = [];
	var id = 0; // to assign ants with unique ids
	// populate world with ants
	for (var row = 0; row < world.height; row++) {
		for (var col = 0; col < world.width; col++) {
			var cell = world.getCell(row, col);
			if (cell.type === "black hill") {
				black_hill_cells.push(cell);
				var ant = new Ant(id++, "black", blackBrain, world);
				ants.push(ant);
				cell.setAnt(ant);
			} else if (cell.type === "red hill") {
				red_hill_cells.push(cell);
				var ant = new Ant(id++, "red", redBrain, world);
				ants.push(ant);
				cell.setAnt(ant);
			}
		}
	}
	var numAnts = ants.length;

	/**
	 * Runs the game in a tight loop for the given number of iterations
	 * @param iterations the number of iterations to run the game for
	 */
	var run = function (iterations) {
		for (var i = 0; i < iterations; i++) {
			for (var id = 0; id < numAnts; id++) {
				ants[id].step();
			}
		}
	};

	/**
	 * Returns an object containing the scores of the two teams
	 * Also how many dead ants there are.
	 * @returns the team scores and number of dead ants
	 */
	var getScore = function () {
		var score = {
			red: {
				food: 0,
				deaths: 0
			},
			black: {
				food: 0,
				deaths: 0
			}
		};

		//iterate over hill cells and add food to score
		for (var i = black_hill_cells.length - 1; i >= 0; i--) {
			score.black.food += black_hill_cells[i].getFood();
		}
		for (var i = red_hill_cells.length - 1; i >= 0; i--) {
			score.red.food += red_hill_cells[i].getFood();
		}

		// iterate over ants and check for deaths
		for (var i = ants.length - 1; i >= 0; i--) {
			if (ants[i].alive === false) {
				score[ants[i].color].deaths += 1;
			}
		}

		return score;
	};

	/**
	 * iterates over the live ants in the world and calls callback
	 * @param callback the callback. takes the ant as parameter
	 */
	var withAnts = function (callback) {
		for (var i = ants.length - 1; i >= 0; i--) {
			callback(ants[i]);
		}
	};

	return {
		run: run,
		getScore: getScore,
		withAnts: withAnts
	};
}
exports.AntGame = AntGame;
