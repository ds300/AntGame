exports.game = exports.game || {};

/**
 * gfx utils
 * These functions pre-render the base graphical components of the game.
 * i.e. food, ants, and the world itself. Markers are simple so are handled
 * elsewhere.
 */
exports.game.gfx_utils = (function () {

/**
 * creates a food sprite
 * @param dx One half the width of a hexagon in the world
 * @param numFood The amount of food this sprite should convey
 * @returns a food sprite
 */
var getFoodCanvas = function (dx, numFood) {
	var canv = document.createElement('canvas');
	canv.width = Math.ceil(2 * dx);
	var dy = dx * Math.tan(Math.PI / 6);
	canv.height =  Math.ceil(4 * dy)
	var ctx = canv.getContext("2d");
	var radius = dx / 5 * numFood * 0.87;
	drawFoodCircle(ctx, canv.width / 2, canv.height / 2, radius)
	return canv;
};

/**
 * private function
 * draws a food circle in a given context at the given size and location
 * @param ctx The canvas 2D context
 * @param x The x-coord of the center of the circle
 * @param y The y-coord of the center of the circle
 * @param radius The radius of the circle
 */
var drawFoodCircle = function (ctx, x, y, radius) {
	ctx.fillStyle = "#008000";
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.fill(); 
};

/**
 * creates a sprite of the given world
 * @param dx One half the width of a hexagon in the world
 * @param grid The world grid (i.e. the result of a call to parseAntWorld)
 * @param drawFood boolean flag to specify whether or not cells containing food
 *        should be drawn as such
 * @returns The world sprite
 */
var getWorldCanvas = function (dx, grid, drawFood) {
	// get world dimensions
	var width = Math.ceil((grid.width * 2 * dx) + dx);
	var dy = dx * Math.tan(Math.PI / 6);
	var height = Math.ceil(dy * ((3 * grid.height) + 1));

	// create canvas
	var canv = document.createElement('canvas');
	canv.width = width;
	canv.height = height;
	var ctx = canv.getContext("2d");

	// pre-compute these for speed
	var twodx = 2 * dx;
	var twody = 2 * dy;

	/**
	 * private function
	 * draws a hexagon of the specified color into the context
	 * @param row The row of the hexagon
	 * @param col The column of the hexagon
	 * @param color The color of the hexagon
	 */
	function drawHex(row, col, color) {
		var x = col * (2 * dx);
		if (row % 2 === 1) { x += dx; } // account for odd rows
		var y = (row * 3 * dy) + dy;
		
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + dx, y - dy);
		ctx.lineTo(x + twodx + twodx, y + twody);
		ctx.lineTo(x + dx, y + (5 * dy));
		ctx.lineTo(x, y + twody);
		ctx.fill();
	}

	// colors of various cell types
	var colors = {
		"#": "#555555",
		"f": "#008000",
		".": "#cfc399",
		"+": "#ca9971",
		"-": "#978f79"
	};

	// don't bother drawing food if not asked to
	if (!drawFood) {
		colors["f"] = colors["."];
	}

	// fill the world in with rock color to begin
	ctx.fillStyle = colors["#"];
	ctx.fillRect(0, 0, width, height);

	// iterate over grid cells and draw them onto context
	for (var row = 0; row < grid.height; row++) {
		for (var col = 0; col < grid.width; col++) {
			drawHex(row, col, colors[grid.cells[row][col].type]);
		}
	}

	return canv;
};


/**
 * draws the world with a width of 420px
 * @param grid The grid
 * @returns The thumbnail sprite
 */
var getWorldThumbnail = function (grid) {
	// get hexagon dimensions
	var dx = 420 / ((2 * grid.width) + 1);
	return getWorldCanvas(dx, grid, true);
};


/**
 * draws an ant sprite
 * @param dx One half the width of a hexagon in the world
 * @param d The direction in which the ant is facing
 * @color The color of the ant
 * @food 1 if the ant is carrying food, 0 otherwise
 * @returns The desired ant sprite
 */
var getAntCanvas = function (dx, d, color, food) {
	// get sprite dimensions
	var dy = dx * Math.tan(Math.PI / 6);
	var width = Math.ceil(dx * 2);
	var height = Math.ceil(dy * 4);

	// create canvas
	var canv = document.createElement("canvas");
	canv.width = width;
	canv.height = height;
	var ctx = canv.getContext("2d");

	// draw the ant
	drawAntFunctions[d](ctx, 0.2 * dx, color);
	
	// if food, draw food
	if (food === 1) {
		// for some reason, the rotation stuff below gets 2 and 4 mixed up
		if (d === 2) {
			d = 4;
		} else if (d === 4) {
			d = 2;
		}
		var x = dx * 0.75,
		    y = 0,
		    theta = d * Math.PI / 3;
		// rotate point
		x = (Math.cos(theta) * x) - (Math.sin(theta) * y);
		y = (Math.sin(theta) * x) + (Math.cos(theta) * y);
		// translate point
		x += dx;
		y += 2 * dy;
		drawFoodCircle(ctx, x, y, 0.3 * dx);
	}
	return canv;
};


/**
 * private functions
 * These draw ants at specific rotations, as indicated by the index of the
 * function in the list. I made the ant image in adobe illustrator, and then
 * converted the saved SVG file into these functions using an online tool
 * which can be found here: http://www.professorcloud.com/svg-to-canvas/
 * The output of that tool includes a ton of cruft, though. Also there is
 * no option for scaling, so I made significant modifications
 * to these functions.
 * @param ctx The 2d canvas context
 * @param scale The scale at which to draw the ant
 * @param color The color of the ant to draw
 */
var drawAntFunctions = [];

drawAntFunctions[0] = function(ctx, scale, color) {
	ctx.lineCap = 'butt';
	ctx.fillStyle = color;
	ctx.lineJoin = 'miter';
	ctx.miterLimit = 4;
	ctx.beginPath();
	ctx.moveTo(1.929 * scale,7.381 * scale);
	ctx.bezierCurveTo(2.7110000000000003 * scale,7.381 * scale,3.402 * scale,6.203 * scale,3.402 * scale,6.203 * scale);
	ctx.lineTo(3.698 * scale,6.37 * scale);
	ctx.lineTo(2.731 * scale,7.93 * scale);
	ctx.lineTo(0.008 * scale,9.175 * scale);
	ctx.lineTo(2.901 * scale,8.133000000000001 * scale);
	ctx.lineTo(3.904 * scale,6.457000000000001 * scale);
	ctx.lineTo(4.494 * scale,6.684000000000001 * scale);
	ctx.lineTo(3.861 * scale,8.103 * scale);
	ctx.lineTo(2.129 * scale,9.186 * scale);
	ctx.lineTo(4.13 * scale,8.229 * scale);
	ctx.lineTo(4.718999999999999 * scale,6.728999999999999 * scale);
	ctx.lineTo(5.221 * scale,6.59 * scale);
	ctx.lineTo(6.146 * scale,8.321 * scale);
	ctx.lineTo(8.04 * scale,8.676 * scale);
	ctx.lineTo(6.29 * scale,8.139 * scale);
	ctx.bezierCurveTo(6.29 * scale,8.139 * scale,5.448 * scale,6.40 * scale,5.457 * scale,6.385 * scale);
	ctx.bezierCurveTo(5.603 * scale,6.27 * scale,5.697 * scale,6.18 * scale,5.697 * scale,6.18 * scale);
	ctx.bezierCurveTo(5.697 * scale,6.18 * scale,5.9510000000000005 * scale,6.904 * scale,6.918 * scale,6.928 * scale);
	ctx.bezierCurveTo(7.457 * scale,6.944 * scale,7.86 * scale,6.588 * scale,8.121 * scale,6.272 * scale);
	ctx.bezierCurveTo(8.129 * scale,6.256 * scale,8.702 * scale,7.355 * scale,8.702 * scale,7.355 * scale);
	ctx.lineTo(9.96 * scale,7.153 * scale);
	ctx.lineTo(8.764 * scale,7.176 * scale);
	ctx.bezierCurveTo(8.764 * scale,7.176 * scale,8.206999999999999 * scale,6.149 * scale,8.222999999999999 * scale,6.126 * scale);
	ctx.bezierCurveTo(8.361999999999998 * scale,5.931 * scale,8.424999999999999 * scale,5.777 * scale,8.424999999999999 * scale,5.777 * scale);
	ctx.bezierCurveTo(8.424999999999999 * scale,5.777 * scale,8.361999999999998 * scale,5.623 * scale,8.223999999999998 * scale,5.437 * scale);
	ctx.bezierCurveTo(8.208 * scale,5.413 * scale,8.765 * scale,4.385 * scale,8.765 * scale,4.385 * scale);
	ctx.lineTo(9.962 * scale,4.401 * scale);
	ctx.lineTo(8.703 * scale,4.2 * scale);
	ctx.bezierCurveTo(8.703 * scale,4.2 * scale,8.129999999999999 * scale,5.300000000000001 * scale,8.122 * scale,5.283 * scale);
	ctx.bezierCurveTo(7.862 * scale,4.966 * scale,7.458 * scale,4.61 * scale,6.93 * scale,4.627 * scale);
	ctx.bezierCurveTo(5.959 * scale,4.652 * scale,5.706 * scale,5.374 * scale,5.706 * scale,5.374 * scale);
	ctx.bezierCurveTo(5.706 * scale,5.374 * scale,5.603 * scale,5.282 * scale,5.465 * scale,5.177 * scale);
	ctx.bezierCurveTo(5.451 * scale,5.152 * scale,6.29 * scale,3.413 * scale,6.29 * scale,3.413 * scale);
	ctx.lineTo(8.046 * scale,2.88 * scale);
	ctx.lineTo(6.153 * scale,3.244 * scale);
	ctx.lineTo(5.22 * scale,4.967 * scale);
	ctx.lineTo(4.71 * scale,4.827 * scale);
	ctx.lineTo(4.121 * scale,3.327 * scale);
	ctx.lineTo(2.1210000000000004 * scale,2.37 * scale);
	ctx.lineTo(3.8510000000000004 * scale,3.4530000000000003 * scale);
	ctx.lineTo(4.476000000000001 * scale,4.864000000000001 * scale);
	ctx.lineTo(3.883 * scale,5.089 * scale);
	ctx.lineTo(2.88 * scale,3.413 * scale);
	ctx.lineTo(0.008 * scale,2.378 * scale);
	ctx.lineTo(2.731 * scale,3.622 * scale);
	ctx.lineTo(3.698 * scale,5.192 * scale);
	ctx.lineTo(3.402 * scale,5.358 * scale);
	ctx.bezierCurveTo(3.402 * scale,5.358 * scale,2.7110000000000003 * scale,4.180999999999999 * scale,1.929 * scale,4.180999999999999 * scale);
	ctx.bezierCurveTo(0.518 * scale,4.180999999999999 * scale,0.399 * scale,5.697999999999999 * scale,0.399 * scale,5.778999999999999 * scale);
	ctx.bezierCurveTo(0.399 * scale,5.777 * scale,0.518 * scale,7.381 * scale,1.929 * scale,7.381 * scale);
	ctx.fill();
	ctx.restore();
};

drawAntFunctions[1] = function(ctx, scale, color) {
	ctx.lineCap = 'butt';
	ctx.fillStyle = color;
	ctx.lineJoin = 'miter';
	ctx.miterLimit = 4;
	ctx.beginPath();
	ctx.moveTo(2.068 * scale,3.933 * scale);
	ctx.bezierCurveTo(2.459 * scale,4.61 * scale,3.825 * scale,4.62 * scale,3.825 * scale,4.62 * scale);
	ctx.lineTo(3.8280000000000003 * scale,4.96 * scale);
	ctx.lineTo(1.994 * scale,4.902 * scale);
	ctx.lineTo(-0.44599999999999995 * scale,3.1660000000000004 * scale);
	ctx.lineTo(1.903 * scale,5.15 * scale);
	ctx.lineTo(3.856 * scale,5.181 * scale);
	ctx.lineTo(3.955 * scale,5.805 * scale);
	ctx.lineTo(2.409 * scale,5.967 * scale);
	ctx.lineTo(0.606 * scale,5.008 * scale);
	ctx.lineTo(2.435 * scale,6.263 * scale);
	ctx.lineTo(4.029 * scale,6.022 * scale);
	ctx.lineTo(4.4 * scale,6.388 * scale);
	ctx.lineTo(3.363 * scale,8.055 * scale);
	ctx.lineTo(4.002 * scale,9.872 * scale);
	ctx.lineTo(3.5919999999999996 * scale,8.088 * scale);
	ctx.bezierCurveTo(3.5919999999999996 * scale,8.088 * scale,4.677 * scale,6.488999999999999 * scale,4.694 * scale,6.488999999999999 * scale);
	ctx.bezierCurveTo(4.867 * scale,6.557999999999999 * scale,4.992 * scale,6.594999999999999 * scale,4.992 * scale,6.594999999999999 * scale);
	ctx.bezierCurveTo(4.992 * scale,6.594999999999999 * scale,4.492 * scale,7.176999999999999 * scale,4.955 * scale,8.026 * scale);
	ctx.bezierCurveTo(5.21 * scale,8.501 * scale,5.72 * scale,8.672 * scale,6.125 * scale,8.74 * scale);
	ctx.bezierCurveTo(6.143 * scale,8.739 * scale,5.478 * scale,9.784 * scale,5.478 * scale,9.784 * scale);
	ctx.lineTo(6.282 * scale,10.774000000000001 * scale);
	ctx.lineTo(5.663 * scale,9.75 * scale);
	ctx.bezierCurveTo(5.663 * scale,9.75 * scale,6.274 * scale,8.754 * scale,6.3020000000000005 * scale,8.756 * scale);
	ctx.bezierCurveTo(6.541 * scale,8.778 * scale,6.705 * scale,8.757 * scale,6.705 * scale,8.757 * scale);
	ctx.bezierCurveTo(6.705 * scale,8.757 * scale,6.807 * scale,8.625 * scale,6.9 * scale,8.413 * scale);
	ctx.bezierCurveTo(6.913 * scale,8.387 * scale,8.081 * scale,8.355 * scale,8.081 * scale,8.355 * scale);
	ctx.lineTo(8.666 * scale,9.4 * scale);
	ctx.lineTo(8.21 * scale,8.208 * scale);
	ctx.bezierCurveTo(8.21 * scale,8.208 * scale,6.971000000000001 * scale,8.261000000000001 * scale,6.981000000000001 * scale,8.246 * scale);
	ctx.bezierCurveTo(7.126 * scale,7.863 * scale,7.231000000000001 * scale,7.335000000000001 * scale,6.953000000000001 * scale,6.886 * scale);
	ctx.bezierCurveTo(6.447 * scale,6.058 * scale,5.695 * scale,6.2 * scale,5.695 * scale,6.2 * scale);
	ctx.bezierCurveTo(5.695 * scale,6.2 * scale,5.724 * scale,6.064 * scale,5.745 * scale,5.892 * scale);
	ctx.bezierCurveTo(5.76 * scale,5.868 * scale,7.6850000000000005 * scale,5.7250000000000005 * scale,7.6850000000000005 * scale,5.7250000000000005 * scale);
	ctx.lineTo(9.024000000000001 * scale,6.979000000000001 * scale);
	ctx.lineTo(7.763 * scale,5.522 * scale);
	ctx.lineTo(5.804 * scale,5.576 * scale);
	ctx.lineTo(5.67 * scale,5.064 * scale);
	ctx.lineTo(6.6739999999999995 * scale,3.803 * scale);
	ctx.lineTo(6.503 * scale,1.593 * scale);
	ctx.lineTo(6.431 * scale,3.633 * scale);
	ctx.lineTo(5.521 * scale,4.879 * scale);
	ctx.lineTo(5.03 * scale,4.479 * scale);
	ctx.lineTo(5.98 * scale,2.773 * scale);
	ctx.lineTo(5.44 * scale,-0.232 * scale);
	ctx.lineTo(5.724 * scale,2.7479999999999998 * scale);
	ctx.lineTo(4.848 * scale,4.371 * scale);
	ctx.lineTo(4.557 * scale,4.197 * scale);
	ctx.bezierCurveTo(4.557 * scale,4.197 * scale,5.231000000000001 * scale,3.01 * scale,4.840000000000001 * scale,2.333 * scale);
	ctx.bezierCurveTo(4.135 * scale,1.11 * scale,2.761 * scale,1.766 * scale,2.691 * scale,1.807 * scale);
	ctx.bezierCurveTo(2.692 * scale,1.806 * scale,1.363 * scale,2.711 * scale,2.068 * scale,3.933 * scale);
	ctx.fill();
	ctx.restore();
};

drawAntFunctions[2] = function(ctx, scale, color) {
	ctx.lineCap = 'butt';
	ctx.fillStyle = color;
	ctx.lineJoin = 'miter';
	ctx.miterLimit = 4;
	ctx.beginPath();
	ctx.moveTo(5.125 * scale,2.329 * scale);
	ctx.bezierCurveTo(4.734 * scale,3.007 * scale,5.409 * scale,4.194 * scale,5.409 * scale,4.194 * scale);
	ctx.lineTo(5.116 * scale,4.367 * scale);
	ctx.lineTo(4.249 * scale,2.75 * scale);
	ctx.lineTo(4.532 * scale,-0.23099999999999987 * scale);
	ctx.lineTo(3.988 * scale,2.795 * scale);
	ctx.lineTo(4.938 * scale,4.502 * scale);
	ctx.lineTo(4.447 * scale,4.899 * scale);
	ctx.lineTo(3.534 * scale,3.642 * scale);
	ctx.lineTo(3.463 * scale,1.601 * scale);
	ctx.lineTo(3.291 * scale,3.812 * scale);
	ctx.lineTo(4.295999999999999 * scale,5.072 * scale);
	ctx.lineTo(4.165 * scale,5.576 * scale);
	ctx.lineTo(2.203 * scale,5.511 * scale);
	ctx.lineTo(0.949 * scale,6.974 * scale);
	ctx.lineTo(2.289 * scale,5.727 * scale);
	ctx.bezierCurveTo(2.289 * scale,5.727 * scale,4.216 * scale,5.867 * scale,4.225 * scale,5.882000000000001 * scale);
	ctx.bezierCurveTo(4.252 * scale,6.066000000000001 * scale,4.2829999999999995 * scale,6.1930000000000005 * scale,4.2829999999999995 * scale,6.1930000000000005 * scale);
	ctx.bezierCurveTo(4.2829999999999995 * scale,6.1930000000000005 * scale,3.528 * scale,6.052 * scale,3.023 * scale,6.877 * scale);
	ctx.bezierCurveTo(2.74 * scale,7.335 * scale,2.847 * scale,7.862 * scale,2.99 * scale,8.246 * scale);
	ctx.bezierCurveTo(3,8.261 * scale,1.762 * scale,8.207 * scale,1.762 * scale,8.207 * scale);
	ctx.lineTo(1.308 * scale,9.398 * scale);
	ctx.lineTo(1.8860000000000001 * scale,8.350999999999999 * scale);
	ctx.bezierCurveTo(1.8860000000000001 * scale,8.350999999999999 * scale,3.0540000000000003 * scale,8.382 * scale,3.066 * scale,8.408 * scale);
	ctx.bezierCurveTo(3.166 * scale,8.626 * scale,3.267 * scale,8.758 * scale,3.267 * scale,8.758 * scale);
	ctx.bezierCurveTo(3.267 * scale,8.758 * scale,3.432 * scale,8.78 * scale,3.662 * scale,8.754 * scale);
	ctx.bezierCurveTo(3.69 * scale,8.751 * scale,4.302 * scale,9.748 * scale,4.302 * scale,9.748 * scale);
	ctx.lineTo(3.6889999999999996 * scale,10.777 * scale);
	ctx.lineTo(4.492999999999999 * scale,9.786999999999999 * scale);
	ctx.bezierCurveTo(4.492999999999999 * scale,9.786999999999999 * scale,3.8269999999999995 * scale,8.741 * scale,3.845999999999999 * scale,8.741999999999999 * scale);
	ctx.bezierCurveTo(4.25 * scale,8.675 * scale,4.76 * scale,8.503 * scale,5.01 * scale,8.037 * scale);
	ctx.bezierCurveTo(5.474 * scale,7.184000000000001 * scale,4.975 * scale,6.604000000000001 * scale,4.975 * scale,6.604000000000001 * scale);
	ctx.bezierCurveTo(4.975 * scale,6.604000000000001 * scale,5.106999999999999 * scale,6.561000000000001 * scale,5.266 * scale,6.493000000000001 * scale);
	ctx.bezierCurveTo(5.295 * scale,6.493000000000001 * scale,6.381 * scale,8.090000000000002 * scale,6.381 * scale,8.090000000000002 * scale);
	ctx.lineTo(5.965 * scale,9.877 * scale);
	ctx.lineTo(6.5969999999999995 * scale,8.056000000000001 * scale);
	ctx.lineTo(5.57 * scale,6.387 * scale);
	ctx.lineTo(5.946000000000001 * scale,6.015 * scale);
	ctx.lineTo(7.540000000000001 * scale,6.255 * scale);
	ctx.lineTo(9.369 * scale,5);
	ctx.lineTo(7.566 * scale,5.957 * scale);
	ctx.lineTo(6.032 * scale,5.793 * scale);
	ctx.lineTo(6.134 * scale,5.168 * scale);
	ctx.lineTo(8.087 * scale,5.138 * scale);
	ctx.lineTo(10.42 * scale,3.168 * scale);
	ctx.lineTo(7.979 * scale,4.903 * scale);
	ctx.lineTo(6.136 * scale,4.956 * scale);
	ctx.lineTo(6.141 * scale,4.617 * scale);
	ctx.bezierCurveTo(6.141 * scale,4.617 * scale,7.506 * scale,4.607 * scale,7.897 * scale,3.93 * scale);
	ctx.bezierCurveTo(8.603 * scale,2.7079999999999997 * scale,7.348 * scale,1.8469999999999995 * scale,7.2780000000000005 * scale,1.8059999999999996 * scale);
	ctx.bezierCurveTo(7.279 * scale,1.807 * scale,5.831 * scale,1.107 * scale,5.125 * scale,2.329 * scale);
	ctx.fill();
	ctx.restore();
};

drawAntFunctions[3] = function(ctx, scale, color) {
	ctx.lineCap = 'butt';
	ctx.fillStyle = color;
	ctx.lineJoin = 'miter';
	ctx.miterLimit = 4;
	ctx.beginPath();
	ctx.moveTo(8.042 * scale,4.174 * scale);
	ctx.bezierCurveTo(7.26 * scale,4.174 * scale,6.569 * scale,5.352 * scale,6.569 * scale,5.352 * scale);
	ctx.lineTo(6.272 * scale,5.185 * scale);
	ctx.lineTo(7.24 * scale,3.625 * scale);
	ctx.lineTo(9.963 * scale,2.38 * scale);
	ctx.lineTo(7.07 * scale,3.422 * scale);
	ctx.lineTo(6.066 * scale,5.098 * scale);
	ctx.lineTo(5.476 * scale,4.8709999999999996 * scale);
	ctx.lineTo(6.109 * scale,3.4519999999999995 * scale);
	ctx.lineTo(7.841 * scale,2.37 * scale);
	ctx.lineTo(5.84 * scale,3.327 * scale);
	ctx.lineTo(5.2509999999999994 * scale,4.827 * scale);
	ctx.lineTo(4.75 * scale,4.965 * scale);
	ctx.lineTo(3.825 * scale,3.234 * scale);
	ctx.lineTo(1.931 * scale,2.879 * scale);
	ctx.lineTo(3.681 * scale,3.416 * scale);
	ctx.bezierCurveTo(3.681 * scale,3.416 * scale,4.523 * scale,5.155 * scale,4.514 * scale,5.17 * scale);
	ctx.bezierCurveTo(4.368 * scale,5.286 * scale,4.273 * scale,5.375 * scale,4.273 * scale,5.375 * scale);
	ctx.bezierCurveTo(4.273 * scale,5.375 * scale,4.019 * scale,4.652 * scale,3.052 * scale,4.628 * scale);
	ctx.bezierCurveTo(2.514 * scale,4.611 * scale,2.111 * scale,4.967 * scale,1.85 * scale,5.284 * scale);
	ctx.bezierCurveTo(1.842 * scale,5.3 * scale,1.27 * scale,4.201 * scale,1.27 * scale,4.201 * scale);
	ctx.lineTo(0.011 * scale,4.402 * scale);
	ctx.lineTo(1.2069999999999999 * scale,4.3790000000000004 * scale);
	ctx.bezierCurveTo(1.2069999999999999 * scale,4.3790000000000004 * scale,1.7639999999999998 * scale,5.406000000000001 * scale,1.7479999999999998 * scale,5.429 * scale);
	ctx.bezierCurveTo(1.609 * scale,5.625 * scale,1.545 * scale,5.778 * scale,1.545 * scale,5.778 * scale);
	ctx.bezierCurveTo(1.545 * scale,5.778 * scale,1.6079999999999999 * scale,5.9319999999999995 * scale,1.746 * scale,6.117999999999999 * scale);
	ctx.bezierCurveTo(1.762 * scale,6.143 * scale,1.206 * scale,7.17 * scale,1.206 * scale,7.17 * scale);
	ctx.lineTo(0.008 * scale,7.154 * scale);
	ctx.lineTo(1.267 * scale,7.356 * scale);
	ctx.bezierCurveTo(1.267 * scale,7.356 * scale,1.84 * scale,6.256 * scale,1.8479999999999999 * scale,6.273 * scale);
	ctx.bezierCurveTo(2.1079999999999997 * scale,6.5889999999999995 * scale,2.512 * scale,6.944999999999999 * scale,3.04 * scale,6.928 * scale);
	ctx.bezierCurveTo(4.011 * scale,6.904 * scale,4.264 * scale,6.181 * scale,4.264 * scale,6.181 * scale);
	ctx.bezierCurveTo(4.264 * scale,6.181 * scale,4.367 * scale,6.273 * scale,4.505 * scale,6.378 * scale);
	ctx.bezierCurveTo(4.52 * scale,6.403 * scale,3.681 * scale,8.143 * scale,3.681 * scale,8.143 * scale);
	ctx.lineTo(1.925 * scale,8.675 * scale);
	ctx.lineTo(3.818 * scale,8.311 * scale);
	ctx.lineTo(4.75 * scale,6.588 * scale);
	ctx.lineTo(5.26 * scale,6.728 * scale);
	ctx.lineTo(5.849 * scale,8.228 * scale);
	ctx.lineTo(7.849 * scale,9.185 * scale);
	ctx.lineTo(6.12 * scale,8.102 * scale);
	ctx.lineTo(5.495 * scale,6.691 * scale);
	ctx.lineTo(6.088 * scale,6.466 * scale);
	ctx.lineTo(7.09 * scale,8.143 * scale);
	ctx.lineTo(9.963000000000001 * scale,9.178 * scale);
	ctx.lineTo(7.24 * scale,7.933 * scale);
	ctx.lineTo(6.273000000000001 * scale,6.3629999999999995 * scale);
	ctx.lineTo(6.569000000000001 * scale,6.1979999999999995 * scale);
	ctx.bezierCurveTo(6.569000000000001 * scale,6.1979999999999995 * scale,7.260000000000001 * scale,7.375 * scale,8.042000000000002 * scale,7.375 * scale);
	ctx.bezierCurveTo(9.453000000000001 * scale,7.375 * scale,9.572000000000001 * scale,5.8580000000000005 * scale,9.572000000000001 * scale,5.777 * scale);
	ctx.bezierCurveTo(9.571 * scale,5.778 * scale,9.453 * scale,4.174 * scale,8.042 * scale,4.174 * scale);
	ctx.fill();
	ctx.restore();
};

drawAntFunctions[4] = function(ctx, scale, color) {
	ctx.lineCap = 'butt';
	ctx.fillStyle = color;
	ctx.lineJoin = 'miter';
	ctx.miterLimit = 4;
	ctx.beginPath();
	ctx.moveTo(7.902 * scale,7.623 * scale);
	ctx.bezierCurveTo(7.511 * scale,6.945 * scale,6.146 * scale,6.936 * scale,6.146 * scale,6.936 * scale);
	ctx.lineTo(6.143 * scale,6.596 * scale);
	ctx.lineTo(7.977 * scale,6.654 * scale);
	ctx.lineTo(10.417 * scale,8.39 * scale);
	ctx.lineTo(8.067 * scale,6.405 * scale);
	ctx.lineTo(6.114 * scale,6.374 * scale);
	ctx.lineTo(6.016 * scale,5.75 * scale);
	ctx.lineTo(7.561 * scale,5.589 * scale);
	ctx.lineTo(9.364 * scale,6.547000000000001 * scale);
	ctx.lineTo(7.536 * scale,5.292 * scale);
	ctx.lineTo(5.941 * scale,5.533 * scale);
	ctx.lineTo(5.571 * scale,5.167 * scale);
	ctx.lineTo(6.608 * scale,3.5 * scale);
	ctx.lineTo(5.968 * scale,1.684 * scale);
	ctx.lineTo(6.378 * scale,3.468 * scale);
	ctx.bezierCurveTo(6.378 * scale,3.468 * scale,5.293 * scale,5.067 * scale,5.276 * scale,5.067 * scale);
	ctx.bezierCurveTo(5.103 * scale,4.997 * scale,4.978 * scale,4.96 * scale,4.978 * scale,4.96 * scale);
	ctx.bezierCurveTo(4.978 * scale,4.96 * scale,5.478 * scale,4.378 * scale,5.015 * scale,3.529 * scale);
	ctx.bezierCurveTo(4.76 * scale,3.054 * scale,4.25 * scale,2.883 * scale,3.846 * scale,2.815 * scale);
	ctx.bezierCurveTo(3.828 * scale,2.817 * scale,4.493 * scale,1.771 * scale,4.493 * scale,1.771 * scale);
	ctx.lineTo(3.689 * scale,0.7809999999999999 * scale);
	ctx.lineTo(4.307 * scale,1.805 * scale);
	ctx.bezierCurveTo(4.307 * scale,1.805 * scale,3.6960000000000006 * scale,2.801 * scale,3.668 * scale,2.799 * scale);
	ctx.bezierCurveTo(3.429 * scale,2.777 * scale,3.265 * scale,2.799 * scale,3.265 * scale,2.799 * scale);
	ctx.bezierCurveTo(3.265 * scale,2.799 * scale,3.164 * scale,2.931 * scale,3.07 * scale,3.143 * scale);
	ctx.bezierCurveTo(3.058 * scale,3.169 * scale,1.889 * scale,3.201 * scale,1.889 * scale,3.201 * scale);
	ctx.lineTo(1.305 * scale,2.156 * scale);
	ctx.lineTo(1.76 * scale,3.347 * scale);
	ctx.bezierCurveTo(1.76 * scale,3.347 * scale,2.999 * scale,3.294 * scale,2.989 * scale,3.309 * scale);
	ctx.bezierCurveTo(2.844 * scale,3.692 * scale,2.739 * scale,4.220000000000001 * scale,3.017 * scale,4.6690000000000005 * scale);
	ctx.bezierCurveTo(3.524 * scale,5.497000000000001 * scale,4.276 * scale,5.355 * scale,4.276 * scale,5.355 * scale);
	ctx.bezierCurveTo(4.276 * scale,5.355 * scale,4.247 * scale,5.4910000000000005 * scale,4.226 * scale,5.663 * scale);
	ctx.bezierCurveTo(4.211 * scale,5.687 * scale,2.286 * scale,5.83 * scale,2.286 * scale,5.83 * scale);
	ctx.lineTo(0.946 * scale,4.576 * scale);
	ctx.lineTo(2.207 * scale,6.034 * scale);
	ctx.lineTo(4.166 * scale,5.98 * scale);
	ctx.lineTo(4.3 * scale,6.491 * scale);
	ctx.lineTo(3.295 * scale,7.752 * scale);
	ctx.lineTo(3.467 * scale,9.963 * scale);
	ctx.lineTo(3.539 * scale,7.922999999999999 * scale);
	ctx.lineTo(4.448 * scale,6.675999999999999 * scale);
	ctx.lineTo(4.94 * scale,7.077 * scale);
	ctx.lineTo(3.99 * scale,8.783 * scale);
	ctx.lineTo(4.53 * scale,11.788 * scale);
	ctx.lineTo(4.246 * scale,8.808 * scale);
	ctx.lineTo(5.122000000000001 * scale,7.185 * scale);
	ctx.lineTo(5.413000000000001 * scale,7.359 * scale);
	ctx.bezierCurveTo(5.413000000000001 * scale,7.359 * scale,4.739000000000001 * scale,8.546 * scale,5.130000000000001 * scale,9.223 * scale);
	ctx.bezierCurveTo(5.836 * scale,10.445 * scale,7.209000000000001 * scale,9.789000000000001 * scale,7.279000000000001 * scale,9.749 * scale);
	ctx.bezierCurveTo(7.278 * scale,9.75 * scale,8.607 * scale,8.845 * scale,7.902 * scale,7.623 * scale);
	ctx.fill();
	ctx.restore();
};

drawAntFunctions[5] = function(ctx, scale, color) {
	ctx.lineCap = 'butt';
	ctx.fillStyle = color;
	ctx.lineJoin = 'miter';
	ctx.miterLimit = 4;
	ctx.beginPath();
	ctx.moveTo(4.846 * scale,9.227 * scale);
	ctx.bezierCurveTo(5.237 * scale,8.549 * scale,4.562 * scale,7.362 * scale,4.562 * scale,7.362 * scale);
	ctx.lineTo(4.855 * scale,7.189 * scale);
	ctx.lineTo(5.722 * scale,8.806000000000001 * scale);
	ctx.lineTo(5.439 * scale,11.787 * scale);
	ctx.lineTo(5.9830000000000005 * scale,8.761000000000001 * scale);
	ctx.lineTo(5.034 * scale,7.054 * scale);
	ctx.lineTo(5.5249999999999995 * scale,6.657 * scale);
	ctx.lineTo(6.436999999999999 * scale,7.915 * scale);
	ctx.lineTo(6.5089999999999995 * scale,9.956 * scale);
	ctx.lineTo(6.680999999999999 * scale,7.744999999999999 * scale);
	ctx.lineTo(5.675999999999999 * scale,6.484999999999999 * scale);
	ctx.lineTo(5.807 * scale,5.98 * scale);
	ctx.lineTo(7.768000000000001 * scale,6.0440000000000005 * scale);
	ctx.lineTo(9.022 * scale,4.582000000000001 * scale);
	ctx.lineTo(7.682 * scale,5.829000000000001 * scale);
	ctx.bezierCurveTo(7.682 * scale,5.829000000000001 * scale,5.755000000000001 * scale,5.689000000000001 * scale,5.746 * scale,5.674 * scale);
	ctx.bezierCurveTo(5.721 * scale,5.489 * scale,5.69 * scale,5.362 * scale,5.69 * scale,5.362 * scale);
	ctx.bezierCurveTo(5.69 * scale,5.362 * scale,6.444000000000001 * scale,5.5040000000000004 * scale,6.948 * scale,4.678 * scale);
	ctx.bezierCurveTo(7.231 * scale,4.221 * scale,7.125 * scale,3.694 * scale,6.981 * scale,3.31 * scale);
	ctx.bezierCurveTo(6.971 * scale,3.295 * scale,8.209 * scale,3.349 * scale,8.209 * scale,3.349 * scale);
	ctx.lineTo(8.664 * scale,2.1580000000000004 * scale);
	ctx.lineTo(8.086 * scale,3.205 * scale);
	ctx.bezierCurveTo(8.086 * scale,3.205 * scale,6.918 * scale,3.174 * scale,6.906000000000001 * scale,3.148 * scale);
	ctx.bezierCurveTo(6.806000000000001 * scale,2.93 * scale,6.705000000000001 * scale,2.798 * scale,6.705000000000001 * scale,2.798 * scale);
	ctx.bezierCurveTo(6.705000000000001 * scale,2.798 * scale,6.54 * scale,2.776 * scale,6.31 * scale,2.802 * scale);
	ctx.bezierCurveTo(6.281 * scale,2.804 * scale,5.669 * scale,1.808 * scale,5.669 * scale,1.808 * scale);
	ctx.lineTo(6.281 * scale,0.7790000000000001 * scale);
	ctx.lineTo(5.476999999999999 * scale,1.7690000000000001 * scale);
	ctx.bezierCurveTo(5.476999999999999 * scale,1.7690000000000001 * scale,6.143 * scale,2.8150000000000004 * scale,6.124 * scale,2.814 * scale);
	ctx.bezierCurveTo(5.721 * scale,2.88 * scale,5.211 * scale,3.052 * scale,4.961 * scale,3.519 * scale);
	ctx.bezierCurveTo(4.497 * scale,4.372 * scale,4.996 * scale,4.952 * scale,4.996 * scale,4.952 * scale);
	ctx.bezierCurveTo(4.996 * scale,4.952 * scale,4.865 * scale,4.995 * scale,4.705 * scale,5.063 * scale);
	ctx.bezierCurveTo(4.676 * scale,5.063 * scale,3.59 * scale,3.4659999999999997 * scale,3.59 * scale,3.4659999999999997 * scale);
	ctx.lineTo(4.007 * scale,1.6789999999999998 * scale);
	ctx.lineTo(3.375 * scale,3.5 * scale);
	ctx.lineTo(4.401 * scale,5.1690000000000005 * scale);
	ctx.lineTo(4.025 * scale,5.541 * scale);
	ctx.lineTo(2.431 * scale,5.301 * scale);
	ctx.lineTo(0.602 * scale,6.556 * scale);
	ctx.lineTo(2.405 * scale,5.599 * scale);
	ctx.lineTo(3.939 * scale,5.763 * scale);
	ctx.lineTo(3.837 * scale,6.388 * scale);
	ctx.lineTo(1.8850000000000002 * scale,6.418 * scale);
	ctx.lineTo(-0.44799999999999995 * scale,8.388 * scale);
	ctx.lineTo(1.991 * scale,6.652 * scale);
	ctx.lineTo(3.835 * scale,6.6 * scale);
	ctx.lineTo(3.83 * scale,6.939 * scale);
	ctx.bezierCurveTo(3.83 * scale,6.939 * scale,2.465 * scale,6.949 * scale,2.074 * scale,7.626 * scale);
	ctx.bezierCurveTo(1.369 * scale,8.848 * scale,2.623 * scale,9.709 * scale,2.693 * scale,9.75 * scale);
	ctx.bezierCurveTo(2.692 * scale,9.749 * scale,4.141 * scale,10.448 * scale,4.846 * scale,9.227 * scale);
	ctx.fill();
	ctx.restore();
};

return {
	getAntCanvas: getAntCanvas,
	getFoodCanvas: getFoodCanvas,
	getWorldCanvas: getWorldCanvas,
	getWorldThumbnail: getWorldThumbnail
}
})();
