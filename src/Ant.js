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

	this.kill = function () {
		var cell = world.getCell(this.row, this.col);
		cell.depositFood(3);
		cell.removeAnt();
		// remove from ants
		this.step = function () {};
	};


	this.hasFood = function () {
		return this.food === 1; 
	};

	this.checkForDeath = function () {
		var count = 0;
		for (var d = 0; d < 6; d++) {
			if (!world.getAdjacentCell(this.row, this.col, d).containsAntOfColor(this.otherColor)) {
				count++;
				if (count > 1) {
					return;
				}
			}
		}
		this.kill();
	};

	this.checkForAdjacentDeaths = function () {
		var adjCells = world.getAllAdjacentCells(this.row, this.col);
		var enemies = [];
		for (var i = 0; i < adjCells.length; i++) {
			if (adjCells[i].containsAntOfColor(this.otherColor)) {
				enemies.push(adjCells[i].getAnt());
			}
		}
		if (enemies.length > 4) {
			this.kill();
		} else {
			for (var i = 0; i < enemies.length; i++) {
				enemies[i].checkForDeath();
			}
		}
	};

	this.getAdjacentCell = function (dir) {
		return world.getAdjacentCell(this.row, this.col, dir);
	};

	this.getCurrentCell = function () {
		return world.getCell(this.row, this.col);
	};

	this.step = function () {
		if (this.resting > 0) {
			this.resting--;
		} else {
			brain[this.state](this);
		}
	};

	this.toString = function () {
		return this.color + " ant of id " + this.id + ", dir " + 
		       this.dir + ", food " + this.food + ", state " + 
		       this.state + ", resting " + this.resting;
	};
}