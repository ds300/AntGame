/**
 * This controls basic menu navigation
 */
var MENU = {
	/**
	 * takes the user to the root of the main menu
	 */
	go: function () { view.menu.goto("root"); },

	/**
	 * initialises the menu
	 * i.e. hooks it up to the view
	 */
	init: function () {
		view.menu.on("goto_root", this.go);
		view.menu.on("goto_single_match", MATCH.go);
		view.menu.on("goto_contest", CONTEST_SETUP.go);
		this.go();
	}
};
