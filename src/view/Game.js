(function () {

exports.game = {};

var maxDx = 8;

var pageWidth = 920;

exports.game.setup = function (grid) {
	$('#ag-run-canv').unbind();
	// find initial dx
	var idx = pageWidth / (2 * grid.width + 1);
	idx = Math.min(maxDx, idx);

	// create world canvases at the different zoom levels
	var zoomLevels = [];

	for (; idx <= maxDx; idx += 1) {
		zoomLevels.push({
			dx: idx,
			canv: this.getWorldCanvas(idx, grid, false)
		});
	}

	var canv = document.getElementById("ag-run-canv");
	var zoomLevel = 0;
	var maxZoom = zoomLevels.length - 1;
	var xoff = 0;
	var yoff = 0;

	canv.width = zoomLevels[0].canv.width;
	canv.height = Math.min(zoomLevels[0].canv.height, 640);
	var cxoff = canv.offsetLeft;
	var cyoff = canv.offsetTop;
	var ctx = canv.getContext("2d");
	

	function refresh () {
		ctx.drawImage(zoomLevels[zoomLevel].canv, xoff, yoff);
	}


	refresh();
	function startDrag (e) {
		console.log(e);
		var x = e.pageX;
		var y = e.pageY;
		window.addEventListener('message', refresh, false);
		window.onmousemove = function (e) {
			xoff = Math.min(0, Math.max(canv.width - zoomLevels[zoomLevel].canv.width, xoff + e.pageX - x));
			yoff = Math.min(0, Math.max(canv.height - zoomLevels[zoomLevel].canv.height, yoff + e.pageY - y));
			window.postMessage("","*");
			x = e.pageX;
			y = e.pageY;
		};
	}

	if (zoomLevels.length > 1) {
		$('#ag-run-canv').bind('mousewheel', function(e) {
			e.originalEvent.preventDefault();
			var pzl, nzl;
	        if (e.originalEvent.wheelDelta > 0) {
	        	//scroll up, zoom in
	        	pzl = zoomLevels[zoomLevel]; // previous zoom level
	        	zoomLevel = Math.min(zoomLevel + 1, maxZoom);
	        	nzl = zoomLevels[zoomLevel]; // next zoom level
	        } else {
	        	//scroll down, zoom out
	        	pzl = zoomLevels[zoomLevel]; // previous zoom level
	        	zoomLevel = Math.max(zoomLevel - 1, 0);
	        	nzl = zoomLevels[zoomLevel]; // next zoom level
	        }
	        
	        // // try to center the window over the place zoomed to

	        // get mouse coords relative to canvas element
	        var xc = e.originalEvent.pageX - this.offsetLeft;
	        var yc = e.originalEvent.pageY - this.offsetTop;

	        // get mouse coords relative to previous zoom level
	        var xp = xc - xoff;
	        var yp = yc - yoff;

	        // get said coords relative to next zoom level
	        var ratio = nzl.canv.width / pzl.canv.width;
	        var xn = xp * ratio;
	        var yn = yp * ratio;

	        // subtract mouse coords relative to canvas and make negative
	        var x = (xn - xc) * -1;
	        var y = (yn - yc) * -1;

	        xoff = Math.min(0, Math.max(canv.width - zoomLevels[zoomLevel].canv.width, x));
	        yoff = Math.min(0, Math.max(canv.height - zoomLevels[zoomLevel].canv.height, y));
	        refresh();
	    });
		
	}



    $('#ag-run-canv').mousedown(startDrag);
    $(window).mouseup(function () {
    	window.onmousemove = undefined;
    	window.removeEventListener("message", refresh, false);
    });
};




exports.game.getWorldCanvas = function (dx, grid, drawFood) {
	var width = Math.ceil((grid.width * 2 * dx) + dx);
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

	if (!drawFood) {
		colors["f"] = colors["."];
	}

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
