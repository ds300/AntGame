/**
 * this provides an access layer to the dynamic elements which comprise the
 * graphical game running screen. I.E. the stuff that shows a world and ants
 * moving around in it doing thier things etc.
 */
(function () {

var events = [
	{
		// the button to cancel the running of the game
		name: "cancel",
		binder: function (callback) {
			$("#ag-run-cancel").click(callback);
		}
	},
	{
		// the buttonn to increase speed
		name: "speed_up",
		binder: function (callback) {
			$("#ag-run-speed-up").click(callback);
		}
	},
	{
		// the button to decrease speed
		name: "speed_down",
		binder: function (callback) {
			$("#ag-run-speed-down").click(callback);
		}
	}
];

var textElems = {
	// the name of the red team
	red_name: {
		get: function () {},
		set: function (text) { $("#ag-run-red-name").text(text); }
	},
	// the name of the black team
	black_name: {
		get: function () {},
		set: function (text) { $("#ag-run-black-name").text(text); }
	},
	// the speed the game is running at
	speed: {
		get: function () {},
		set: function (text) { $("#ag-run-speed").text(text); }
	}
};

exports.game = new LogicalGroup(events, textElems);


/*****************************************************************************/
/*********** This is where all of the graphical stuff is managed *************/
/*****************************************************************************/


var maxDx = 14; // one half of the maximum horizontal width of a hexagon

var mctx; // the marker canvas context
var fctxs; // the food canvas contexts
var actx; // the ant canvas context

var foodSprites;
var antSprites;

var spriteWidth;
var spriteHeight;

var hexTopLefts;
var markerPositions;

var dx; // half the width of a hexagon
var dy; // quarter the height of a hexagon

var canvasWidth;
var canvasHeight;

var markerColors = {
	red: ["#bc7f65", "#d47c62", "#e28b72", "#e19996", "#e28b8e", "#d9a0a1"],
	black: ["#a6c4b7", "#97b3bc", "#979dbc", "#a6b7b7", "#838cba", "#867ca4"]
};

var markerSize;

/**
 * private function
 * gets the viewport width and height
 * I took this code snippet from http://stackoverflow.com/a/7766007/1382997
 * @returns the viewport width and height
 */
function viewport() {
	var global = window
	, x = 'inner';
	if (!( 'innerWidth' in window)) {
		x = 'client';
		global = document.documentElement || document.body;
	}
	return { 
		width: global[ x + 'Width' ],
		height: global[ x + 'Height' ]
	}
}

/**
 * Sets up the visuals for the beginning of a game
 * @param grid The parsed grid of a world (i.e. the result of a call to 
 * parseAntWorld)
 */
exports.game.setup = function (grid) {

	var pageWidth = viewport().width - 18;

	// find initial dx
	dx = pageWidth / (2 * grid.width + 1);
	dx = Math.min(maxDx, dx);

	// pre-render food and ants for this zoom level
	foodSprites = [];
	for (var i = 1; i <= 5; i++) {
		foodSprites.push(this.gfx_utils.getFoodCanvas(dx, i));
	}

	spriteWidth = foodSprites[0].width;
	spriteHeight = foodSprites[0].height;

	antSprites = {
		red: [[], []],
		black: [[], []]
	};

	// for each rotation
	for (var d = 0; d < 6; d++) {
		// with and without food
		for (var food = 0; food < 2; food++) {
			antSprites["red"][food].push(this.gfx_utils.getAntCanvas(dx, d, "#A00", food));
			antSprites["black"][food].push(this.gfx_utils.getAntCanvas(dx, d, "#000", food));
		}
	}

	// pre-compute the top-left corners of hexagons
	hexTopLefts = [];
	dy = dx * Math.tan(Math.PI / 6);
	for (var row = 0; row < grid.height; row++) {
		hexTopLefts.push([]);
		for (var col = 0; col < grid.width; col++) {
			var x = 2 * dx * col;
			if (row % 2 === 1) { x += dx; }
			hexTopLefts[row][col] = {
				x: x,
				y: 3 * dy * row
			}
		}
	}

	// pre-compute marker positions
	markerSize = Math.ceil(dx / 3);
	markerPositions = [];
	for (var row = 0; row < grid.height; row++) {
		markerPositions.push([]);
		for (var col = 0; col < grid.width; col++) {
			markerPositions[row].push({red: [], black: []});
			// get the center of the hexagon we're lookin' at
			var center = {
				x: hexTopLefts[row][col].x + dx,
				y: hexTopLefts[row][col].y + (2 * dy)
			};
			var offsets = {"red": 1, "black": -1};
			for (var color in offsets) {
				for (var k = 0; k < 6; k++) {
					// find their center positions
					var x = center.x + (Math.abs(Math.abs(k - 2.5) - 2.5) / 2.5) * 0.8 * dx * offsets[color];
					var y = center.y + (k - 2.5) / 2.5 * 2 * dy;
					// subtract half of marker size to get them in the right place
					x -= Math.ceil(markerSize / 2);
					y -= Math.ceil(markerSize / 2);
					// integerize for speed get
					x = Math.round(x);
					y = Math.round(y);
					markerPositions[row][col][color][k] = {x: x, y: y};
				}
			}
		}
	}


	// integerize hex positions for speed get

	for (var row = 0; row < grid.height; row++) {
		for (var col = 0; col < grid.width; col++) {
			var htl = hexTopLefts[row][col];
			htl.x = Math.round(htl.x);
			htl.y = Math.round(htl.y);
		}
	}

	// pre-render world sprite
	var world_sprite = this.gfx_utils.getWorldCanvas(dx, grid, false);

	// get all the canvases
	var bcanv = document.getElementById("ag-run-canv-base");
	var mcanv = document.getElementById("ag-run-canv-marker");
	// we have two canvases for food. one for odd rows, one for even.
	// it is done this way because otherwise when we remove food, we could
	// be deleting bits from the row above/below
	var fcanv0 = document.getElementById("ag-run-canv-food-even");
	var fcanv1 = document.getElementById("ag-run-canv-food-odd");
	var acanv = document.getElementById("ag-run-canv-ants");

	canvasWidth = world_sprite.width;
	canvasHeight = world_sprite.height;

	// set their sizes
	bcanv.width = mcanv.width = fcanv0.width = fcanv1.width = acanv.width = canvasWidth;
	bcanv.height = mcanv.height = fcanv0.height = fcanv1.height = acanv.height = canvasHeight;

	// set contexts
	mctx = mcanv.getContext("2d");
	fctxs = [fcanv0.getContext("2d"), fcanv1.getContext("2d")];
	actx = acanv.getContext("2d");


	// draw world sprite onto base canvas
	bcanv.getContext("2d").drawImage(world_sprite, 0, 0);

	// draw initial foods
    for (var row = 0; row < grid.height; row++) {
    	for (var col = 0; col < grid.width; col++) {
    		if (grid.cells[row][col].type === "f") {
    			drawFood(row, col, grid.cells[row][col].quantity);
    		}
    	}
    }
};

var topleft;

/**
 * draws an ant onto the ant canvas
 * @param ant The ant
 */
var drawAnt = function (ant) {
	if (ant.alive) {
		topleft = hexTopLefts[ant.cell.row][ant.cell.col];
		actx.drawImage(antSprites[ant.color][ant.food][ant.dir], topleft.x, topleft.y);
	}
};

exports.game.drawAnt = drawAnt;

/**
 * draws a particle of food onto a food canvas
 * @param row The row at which the food particle is to be drawn
 * @param col The column at which the food particle is to be drawn
 * @param num The amount of food at this position
 */
var drawFood = function (row, col, num) {
	topleft = hexTopLefts[row][col];
	fctxs[row % 2].clearRect(topleft.x, topleft.y, spriteWidth, spriteHeight);
	if (num > 0) {
		fctxs[row % 2].drawImage(foodSprites[num > 4 ? 4 : num], topleft.x, topleft.y);
	}
};

exports.game.drawFood = drawFood;

/**
 * clears the ant canvas to make it ready for a new frame
 */
var newFrame = function () {
	actx.clearRect(0, 0, canvasWidth, canvasHeight);
};

exports.game.newFrame = newFrame;

var mpos;

/**
 * draws a marker onto the marker canvas
 * @param row The row of the cell containing the marker
 * @param col The column of the cell containing the marker
 * @param color The color of the ant who placed the marker
 * @param marker The id of the marker to draw
 */
var mark = function (row, col, color, marker) {
	mctx.fillStyle = markerColors[color][marker];
	mpos = markerPositions[row][col][color][marker];
	mctx.fillRect(mpos.x, mpos.y, markerSize, markerSize);
};

/**
 * removes a marker from the marker canvas
 * @param row The row of the cell containing the marker
 * @param col The column of the cell containing the marker
 * @param color The color of the ant who placed the marker
 * @param marker The id of the marker to remove
 */
var unmark = function (row, col, color, marker) {
	mpos = markerPositions[row][col][color][marker];
	mctx.clearRect(mpos.x, mpos.y, markerSize, markerSize);
};

exports.game.mark = mark;
exports.game.unmark = unmark;



})();
