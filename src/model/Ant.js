/**
 * Ant
 * This function returns an object which represents an ant in our simulation.
 * @param id the unique id number of the ant
 * @param color the color of the ant. Should be either red or black
 * @param brain the list of instruction functions which act upon the ant
 * @param world the world in which this ant will be deployed
 */
function Ant(id, color, brain, world) {

	// initialise variables
	this.color = color;
	this.otherColor = color === "red" ? "black" : "red";
	this.id = id;
	this.state = 0;
	this.dir = 0;
	this.resting = 0;
	this.food = 0;
	this.alive = true;
	this.cell = null;

	/**
	 * Kills the ant, deposits food
	 */
	this.kill = function () {
		this.cell.depositFood(3 + this.food);
		this.cell.removeAnt();
		this.alive = false;
		this.step = function () {};
	};


	/**
	 * Returns true if the ant is carrying food
	 */
	this.hasFood = function () {
		return this.food === 1; 
	};


	var count, d;
	/**
	 * Checks adjacent cells for enemies. If there are 5 or 6, kills this ant.
	 */
	this.checkForDeath = function () {
		count = 0; // count number of cells not containing enemies
		// iterate over directions
		for (d = 0; d < 6; d++) {
			if (!this.cell.adjacentCells[d].containsAntOfColor(this.otherColor)) {
				count++;
				// if we've seen two cells with no enemies, just return
				if (count > 1) {
					return;
				}
			}
		}
		// at least 5 enemies adjacent to this ant, so death.
		this.kill();
	};

	var enemies = [null, null, null, null, null, null];
	var enemyPointer = -1;
	var i = 0;

	/**
	 * Iterates over adjacent cells and checks for enemy deaths
	 * also checks this ant for death in the process
	 */
	this.checkForAdjacentDeaths = function () {
		enemyPointer = -1;
		d = 6;
		while (d--) {
			if (this.cell.adjacentCells[d].containsAntOfColor(this.otherColor)) {
				enemies[++enemyPointer] = this.cell.adjacentCells[d].getAnt();
			}
		}
		if (enemyPointer > 3) {
			this.kill();
		} else {
			enemyPointer++;
			while (enemyPointer--) {
				enemies[enemyPointer].checkForDeath();
			}
		}
		
	};


	/**
	 * Causes the ant to rest for 14 iterations
	 */
	this.rest = function () {
		this.resting = 14;
		this.step = function () {
			if (--this.resting === 0) {
				this.step = execute;
			}
		};
	};

	// execute next instrction
	var execute = function () {
		brain[this.state](this);
	};

	/**
	 * Causes the ant to do whatever it is supposed to do for this
	 * particular iteration.
	 */
	this.step = execute;

	/**
	 * Returns a string represenation of the ant
	 */
	this.toString = function () {
		return this.color + " ant of id " + this.id + ", dir " + 
		       this.dir + ", food " + this.food + ", state " + 
		       this.state + ", resting " + this.resting;
	};
}
exports.Ant = Ant;
