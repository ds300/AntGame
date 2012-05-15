$(document).ready(function () {
	// var activeMatch = Match(), 
	// 	activeContest = Contest();

	// setup initial view config
	view.hideAll();
	view.show("main_menu");

	// setup static-behaviour buttons
	view.on("goto_main_menu", function () {
		view.hideAll();
		view.show("main_menu");
	});

	view.on("goto_single_match", function () {
		view.hide("main_menu");
		view.show("single_match_setup");
	});
});