(function () {

var width = 420; 

exports.getWorldThumbnail = function (grid) {
	// get hexagon dimensions
	var dx = width / ((2 * grid.width) + 1);
	var dy = dx * Math.tan(Math.PI / 6);
	var twody = 2 * dy;
	var twodx = 2 * dx;

	// get canvas height;
	var height = Math.ceil(dy * ((3 * grid.height) + 1));

	var canv = document.createElement('canvas');
	canv.width = width;
	canv.height = height;

	var ctx = canv.getContext("2d");

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

	var colors = {
		"#": "#555555",
		"f": "#008000",
		".": "#cfc399",
		"+": "#ca9971",
		"-": "#978f79"
	};

	ctx.fillStyle = colors["#"];
	ctx.fillRect(0, 0, width, height);

	for (var row = 0; row < grid.height; row++) {
		for (var col = 0; col < grid.width; col++) {
			drawHex(row, col, colors[grid.cells[row][col].type]);
		}
	}


	return canv;

};

})();
