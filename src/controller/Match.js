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
		view.single_match.text("world_name", WORLDS[_match.world_id].name);
	};


	function _validateRounds(str) {
		view.single_match.text("rounds", str.replace(/\D/g, ""));
	};

	function _getPickCallback(color) {
		return function () {
			BRAIN_LIST.go("sm");
			view.brain_list.trigger("select", [_match[color + "_id"]]);
			view.brain_list.on("pick", function (id) { 
				_match[color + "_id"] = id;
				go();
			}, true);
		};
	};

	var run = function () {
		var f = _match.vis ? RUN : RUN_SANS;
		f.go
	}

	var init = function () {
		// hook up things
		with (view.single_match) {
			on("pick_red", _getPickCallback("red"));
			on("pick_black", _getPickCallback("black"));
			on("pick_world", function () {
				WORLD_LIST.go("sm");
				WORLD_LIST.refresh();
				view.world_list.trigger("select", [_match.world_id]);
				view.world_list.on("pick", function (id) {
					_match.world_id = id;
					go();
				}, true);
			});
			on("rounds_change", _validateRounds);
			on("vis_off", function () {
				_match.vis = false;
			});
			on("vis_on", function () {
				_match.vis = true;
			});
			on("go", function () {
				var f = _match.vis ? RUN : RUN_SANS;
				f.go(
					BRAINS[_match.red_id],
					BRAINS[_match.black_id],
					WORLDS[_match.world_id],
					text("rounds"),
					function (results) {
						showResults(results);
						on("results_close", function () {
							go();
						}, true);
					},
					function () {
						go();
					}
				);
			}, true);
		}
	};

	return {
		go: go,
		init: init,
		redId: function (id) { 
			if (typeof id === "number") {
				_match.red_id = id;
			} else {
				return _match.red_id;
			}
		},
		blackId: function (id) { 
			if (typeof id === "number") {
				_match.black_id = id;
			} else {
				return _match.black_id;
			}
		},
		worldId: function (id) {
			if (typeof id === "number") {
				_match.world_id = id;
			} else {
				return _match.world_id;
			}
		}
	};

})();
	