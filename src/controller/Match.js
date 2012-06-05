/**
 * This controls the coordination and running of single matches.
 */
var MATCH = (function () {

	// this holds the metadata for the match to be played
	var _match = {
		red_id: 0,
		black_id: 1,
		world_id: 0,
		game: null,
		vis: true
	};

	/**
	 * takes the user to the single match setup screen
	 */
	var go = function () {
		view.menu.goto("single_match");
		view.single_match.text("red_name", BRAINS[_match.red_id].name);
		view.single_match.text("black_name", BRAINS[_match.black_id].name);
		view.single_match.text("world_name", WORLDS[_match.world_id].name);
	};

	/**
	 * private function 
	 * makes sure that the number of rounds specified by the user is valid
	 * @param str A string representation of the number of rounds
	 */
	function _validateRounds(str) {
		view.single_match.text("rounds", str.replace(/\D/g, ""));
	};

	/**
	 * private function
	 * returns a callback that is triggered when the user decides to choose
	 * a brain for a partucilar team
	 * @param color The color of the team the user will be picking a brain for
	 */
	function _getPickCallback(color) {
		return function () {
			// go to the brain list
			BRAIN_LIST.go("sm");
			// highlight the brain currently in use
			view.brain_list.trigger("select", [_match[color + "_id"]]);
			// when the user picks a new one
			view.brain_list.on("pick", function (id) { 
				// update match object
				_match[color + "_id"] = id;
				// return to single match setup screen
				go();
			}, true);
		};
	};

	/**
	 * initialises the single match setup screen
	 * i.e. hooks up the view
	 */
	var init = function () {
		// hook up things
		with (view.single_match) {
			// when the user decides to pick a red brain
			on("pick_red", _getPickCallback("red"));
			// when the user decides to pick a black brain
			on("pick_black", _getPickCallback("black"));
			// when the user decides to pick a world
			on("pick_world", function () {
				// go to the world list
				WORLD_LIST.go("sm");
				WORLD_LIST.refresh();
				// highlight the currenlty selected world
				view.world_list.trigger("select", [_match.world_id]);
				// when the user picks a new world
				view.world_list.on("pick", function (id) {
					// update match object
					_match.world_id = id;
					// return to the single match setup screen
					go();
				}, true);
			});
			// when the user changes the desired number of rounds
			on("rounds_change", _validateRounds);
			// when the user toggles graphics off
			on("vis_off", function () {
				_match.vis = false;
			});
			// when the user toggles graphics on
			on("vis_on", function () {
				_match.vis = true;
			});
			// when the user decides to run the match
			on("go", function () {
				// decide whether to run with or without graphics
				var f = _match.vis ? RUN : RUN_SANS;
				// go
				f.go(
					BRAINS[_match.red_id],
					BRAINS[_match.black_id],
					WORLDS[_match.world_id],
					text("rounds"),
					function (results) {
						// on finish, show results
						showResults(results);
						// when the user has finished looking at the results
						on("results_close", function () {
							// go back to single match setup screen
							go();
						}, true);
					},
					function () {
						// on cancel, return to single match setup screen
						go();
					}
				);
			}, true);
		}
	};

	return {
		go: go,
		init: init,
		/**
		 * sets or gets the id of the currently selected red brain
		 * @param id (optional) the id of the brain to set
		 */
		redId: function (id) { 
			if (typeof id === "number") {
				_match.red_id = id;
			} else {
				return _match.red_id;
			}
		},
		/**
		 * sets or gets the id of the currently selected black brain
		 * @param id (optional) the id of the brain to set
		 */
		blackId: function (id) { 
			if (typeof id === "number") {
				_match.black_id = id;
			} else {
				return _match.black_id;
			}
		},
		/**
		 * sets or gets the id of the currently selected world
		 * @param id (optional) the id of the brain to set
		 */
		worldId: function (id) {
			if (typeof id === "number") {
				_match.world_id = id;
			} else {
				return _match.world_id;
			}
		}
	};

})();
	