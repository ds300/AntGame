(function () {

var width = 420; 

exports.getWorldThumbnail = function (grid) {
	// get hexagon dimensions
	var dx = width / ((2 * grid.width) + 1);
	return this.game.getWorldCanvas(dx, grid, true);

};

})();
