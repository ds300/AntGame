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

	this.kill = function () {
		this.cell.depositFood(3);
		this.cell.removeAnt();
		this.alive = false;
		this.step = function () {};
	};


	this.hasFood = function () {
		return this.food === 1; 
	};

	var count, d;

	this.checkForDeath = function () {
		count = 0;
		for (d = 0; d < 6; d++) {
			if (!this.cell.adjacentCells[d].containsAntOfColor(this.otherColor)) {
				count++;
				if (count > 1) {
					return;
				}
			}
		}
		this.kill();
	};

	var enemies = [null, null, null, null, null, null];
	var enemyPointer = -1;
	var i = 0;

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

	this.getAdjacentCell = function (dir) {
		return this.cell.adjacentCells[dir];
	};

	this.rest = function () {
		this.resting = 14;
		this.step = function () {
			if (--this.resting === 0) {
				this.step = execute;
			}
		};
	};

	var execute = function () {
		brain[this.state](this);
	};

	this.step = execute;

	this.toString = function () {
		return this.color + " ant of id " + this.id + ", dir " + 
		       this.dir + ", food " + this.food + ", state " + 
		       this.state + ", resting " + this.resting;
	};
}
exports.Ant = Ant;
