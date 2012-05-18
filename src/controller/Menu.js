var MENU = {
	go: function () { view.menu.goto("root"); },

	init: function () {
		view.menu.on("goto_root", this.go);
		view.menu.on("goto_single_match", MATCH.go);
		view.menu.on("goto_contest", CONTEST.go);
		this.go();
	}
};