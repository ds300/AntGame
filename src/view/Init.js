/**
 * initialises the view components
 */
exports.init = function () {
	this.menu.init();
	this.single_match.init();
	this.brain_list.init();
	this.world_list.init();
	this.edit.init();
	this.contest.init();
	this.contest.brains.init();
	this.contest.worlds.init();
	this.run_sans.init();
	this.game.init();
	$("#loading-bg").hide();
};