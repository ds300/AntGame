/**
 * When the document is ready, according to jquery, we initialise the
 * controller submodules.
 */

$(document).ready(function () {
	
	view.init();
	BRAIN_LIST.init();
	MATCH.init();
	MENU.init();
	EDIT.init();
	WORLD_LIST.init();
	CONTEST.init();
	CONTEST_SETUP.init();

});

