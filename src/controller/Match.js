var MATCH = (function () {

	// this holds the metadata for the match to be played
	var _match = {
		red_id: 0,
		black_id: 1,
		world_id: 0,
		game: null,
		vis: true
	};

	var go = function () {
		view.menu.goto("single_match");
		view.single_match.text("red_name", BRAINS[_match.red_id].name);
		view.single_match.text("black_name", BRAINS[_match.black_id].name);
	};


	function _validateRounds(str) {
		view.single_match.text("rounds", str.replace(/D/g, ""));
	};

	function _getPickCallback(color) {
		return function () {
			view.menu.goto("sm_pick_brain");
			BRAIN_LIST.highlight(_match[color + "_id"]);
			view.brain_list.on("pick", function (id) { 
				_match[color + "_id"] = brain_id;
				go();
			});
		};
	};

	var init = function () {
		// hook up things
		with (view.single_match) {
			on("pick_red", _getPickCallback("red"));
			on("pick_black", _getPickCallback("black"));
			on("rounds_change", _validateRounds);
			on("vis_off", function () {
				_match.vis = false;
			});
			on("vis_on", function () {
				_match.vis = true;
			});
		}
	};

	return {
		go: go,
		init: init
	};

})();
	