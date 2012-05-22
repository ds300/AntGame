function Ant(id, color, brain, world) {

	// initialise variables
	this.color = color;
	this.otherColor = color === "red" ? "black" : "red";
	this.id = id;
	this.row = 0;
	this.col = 0;
	this.state = 0;
	this.dir = 0;
	this.resting = 0;
	this.food = 0;
	this.alive = true;

	this.kill = function () {
		var cell = world.getCell(this.row, this.col);
		cell.depositFood(3);
		cell.removeAnt();
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
			if (!world.getAdjacentCell(this.row, this.col, d).containsAntOfColor(this.otherColor)) {
				count++;
				if (count > 1) {
					return;
				}
			}
		}
		this.kill();
	};

	var adjCells = [null, null, null, null, null, null];
	var enemies = [null, null, null, null, null, null];
	var enemyPointer = -1;
	var i = 0;

	this.checkForAdjacentDeaths = function () {
		enemyPointer = -1;
		d = 6;
		while (d--) {
			adjCells[d] = world.getAdjacentCell(this.row, this.col, d);
			if (adjCells[d].containsAntOfColor(this.otherColor)) {
				enemies[++enemyPointer] = adjCells[d].getAnt();
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
		return world.getAdjacentCell(this.row, this.col, dir);
	};

	this.getCurrentCell = function () {
		return world.getCell(this.row, this.col);
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
