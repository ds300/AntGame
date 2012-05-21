(function () {

exports.game = {};

var maxDx = 8; // one half of the maximum horizontal width of a hexagon

var pageWidth = 910; // the maximum width the base canvas can be
var pageHeight = 600; // the maximum height the base canvas can be

var xoff = 0; // the x offset of the current zoom level canvas
var yoff = 0; // the y offset of the current zoom level canvas

var currentzl = 0; // current zoom level #
var czl; // current zoom level object

var zoomLevels = []; // holds canvases for the various zoom levels

var bcanv; // the base canvas
var ocanv; // the object canvas

var bctx; // base context
var octx; // obj context

var maxZoom;

var foodsQueue = [];
var foodsQueuePointer;
var foods; // array sized same as grid holds current food value of every cell.

var marker


exports.game.setup = function (grid) {
	// get rid of event listeners on the base canvas
	$('#ag-run-canv').unbind();

	// find initial dx
	var idx = pageWidth / (2 * grid.width + 1);
	idx = Math.min(maxDx, idx);

	// create canvases at the different zoom levels
	zoomLevels = [];

	for (; idx <= maxDx; idx += 1) {
		// pre-render food and ants for this zoom level
		var foods = [];
		for (var i = 1; i <= 5; i++) {
			foods.push(this.gfx_utils.getFoodCanvas(idx, i));
		}
		var red_ants = [];
		var black_ants = [];
		for (var d = 0; d < 6; d++) {
			red_ants.push(this.gfx_utils.getAntCanvas(idx, d, "#A00"));
			black_ants.push(this.gfx_utils.getAntCanvas(idx, d, "#000"));
		}
		// pre-compute the top-left corners of hexagons
		var hexTopLefts = [];
		var idy = idx * Math.tan(Math.PI / 6);
		for (var row = 0; row < grid.width; row++) {
			hexTopLefts.push([]);
			for (var col = 0; col < grid.height; col++) {
				var x = 2 * idx * col;
				if (row % 2 === 1) { x += idx; }
				hexTopLefts[row][col] = {
					x: x,
					y: 3 * idy * row
				}
			}
		}
		var world_canvas = this.gfx_utils.getWorldCanvas(idx, grid, false);
		// we need three canvases
		var a = document.createElement("canvas"),
			b = document.createElement("canvas"),
			c = document.createElement("canvas");

		a.width = b.width = c.width = world_canvas.width;
		a.height = b.height = c.height = world_canvas.height;

		var food_canvs = [a, b];
		var food_ctxs = [a.getContext("2d"), b.getContext("2d")];
		
		zoomLevels.push({
			dx: idx,
			world_canv: world_canvas,
			foods: foods,
			food_canvs: [a, b],
			food_ctxs: [a.getContext("2d"), b.getContext("2d")],
			marker_canv: c,
			marker_ctx: c.getContext("2d"),
			red: red_ants,
			black: black_ants,
			hexTopLefts: hexTopLefts
		});
	}

	bcanv = document.getElementById("ag-run-canv-base");
	ocanv = document.getElementById("ag-run-canv-obj");

	currentzl = 0;
	czl = zoomLevels[0];

	maxZoom = zoomLevels.length - 1;

	xoff = 0;
	yoff = 0;

	ocanv.width = bcanv.width = zoomLevels[0].world_canv.width;
	ocanv.height = bcanv.height = Math.min(zoomLevels[0].world_canv.height, 640);

	bctx = bcanv.getContext("2d");
	octx = ocanv.getContext("2d");
	

	if (zoomLevels.length > 1) {
		var eventName;
		// firefox handles mouse scrolling differently to all other browsers
		if (navigator.userAgent && navigator.userAgent.match(/Firefox/)) {
			ocanv.addEventListener("DOMMouseScroll", function (e) {
				e.preventDefault();
				if (e.detail < 0) {
					zoom(1, e.pageX, e.pageY);
				} else if (e.detail > 0) {
					zoom(-1, e.pageX, e.pageY);
				}
			}, true);
		} else {
			ocanv.addEventListener("mousewheel", function (e) {
				e.preventDefault();
				if (e.wheelDelta > 0) {
					zoom(1, e.pageX, e.pageY);
				} else if (e.wheelDelta < 0) {
					zoom(-1, e.pageX, e.pageY);
				}
			}, true);
		}
	}

	console.log("setting stuff");

    $('#ag-run-canv-obj').mousedown(startDrag);
    $(window).mouseup(function () {
    	window.onmousemove = undefined;
    	window.removeEventListener("message", refreshWorld, false);
    });


    // ok
    refreshWorld();
};

var topleft;

var drawAnt = function (row, col, dir, color) {
	topleft = czl.hexTopLefts[row][col];
	octx.drawImage(czl[color][dir], topleft.x + xoff, topleft.y + yoff);
};

exports.game.drawAnt = drawAnt;

var newFrame = function () {
	octx.clearRect(0, 0, ocanv.width, ocanv.height);
	octx.drawImage(czl.marker_canv, xoff, yoff);
	octx.drawImage(czl.food_canvs[0], xoff, yoff);
	octx.drawImage(czl.food_canvs[1], xoff, yoff);
};

exports.game.newFrame = newFrame;

var pzl; // previous zoom  level
var anchor = document.getElementById("ag-run-anchor");
function zoom(inout, pageX, pageY) {
	// recalculate zoom levels
	pzl = czl;
	currentzl = Math.min(Math.max(currentzl + inout, 0), maxZoom);
	czl = zoomLevels[currentzl];

	var newWidth = czl.world_canv.width;
	var newHeight = czl.world_canv.height;
	// get mouse coords relative to canvas element
	
	var xc = pageX - anchor.offsetLeft;
	var yc = pageY - 60;

	// get mouse coords relative to previous zoom level
	var xp = xc - xoff;
	var yp = yc - yoff;

	// get said coords relative to next zoom level
	var ratio = newWidth / pzl.world_canv.width;
	var xn = xp * ratio;
	var yn = yp * ratio;

	// subtract mouse coords relative to canvas and make negative
	var x = (xn - xc) * -1;
	var y = (yn - yc) * -1;


	xoff = Math.min(0, Math.max(bcanv.width - newWidth, x));
	yoff = Math.min(0, Math.max(bcanv.height - newHeight, y));
	
	// copy markers and food

	czl.marker_ctx.clearRect(0, 0, newWidth, newHeight);
	czl.food_ctxs[0].clearRect(0, 0, newWidth, newHeight);
	czl.food_ctxs[1].clearRect(0, 0, newWidth, newHeight);

	czl.marker_ctx.drawImage(pzl.marker_canv, 0, 0, newWidth, newHeight);
	czl.food_ctxs[0].drawImage(pzl.food_canvs[0], 0, 0, newWidth, newHeight);
	czl.food_ctxs[1].drawImage(pzl.food_canvs[1], 0, 0, newWidth, newHeight);

	refreshWorld();
	newFrame();

}

// this function recurses up the DOM tree to find out where 
// an element is with regard to the window.
function getOffset(elem) {
	if (elem && elem.hasOwnProperty("offsetTop")) {
		var x = elem.offsetLeft,
			y = elem.offsetTop;
		var next = getOffset(elem.offsetParent);
		return { 
			x: x + next.x,
			y: y + next.y
		}; 
	} else {
		return {x: 0, y: 0};
	}
}



function refreshWorld () {
	bctx.drawImage(czl.world_canv, xoff, yoff);
	newFrame();
}

function startDrag (e) {
	var x = e.pageX;
	var y = e.pageY;
	window.onmousemove = function (e) {
		xoff = Math.min(0, Math.max(bcanv.width - czl.world_canv.width, xoff + e.pageX - x));
		yoff = Math.min(0, Math.max(bcanv.height - czl.world_canv.height, yoff + e.pageY - y));
		refreshWorld();
		x = e.pageX;
		y = e.pageY;
	};
}


})();