/**
 * This controls the contest setup screen
 */
var CONTEST_SETUP = (function () {

	// this holds the metadata for the contest to be run
	var _contest = {
		brains: [],
		worlds: [],
		game: null,
		vis: true
	};

	/**
	 * takes the user to the contest setup screen
	 */
	var go = function () {
		view.menu.goto("contest_setup");
		_refreshList("brains");
		_refreshList("worlds");
	};

	/**
	 * private function
	 * refreshes a component list
	 * @param component The component type whose list will be refreshed
	 */
	function _refreshList(component) {
		if (_contest[component].length === 0) {
			view.contest[component].sayEmpty();
			return;
		}
		// pick resources
		var resources = component === "brains" ? BRAINS : WORLDS;

		// get and clear view list
		var v = view.contest[component];
		v.clear();

		// now populate it
		for (var i = _contest[component].length - 1; i >= 0; i--) {
			var id = _contest[component][i];
			v.add(resources[id].name, id);
		};
	}

	/**
	 * initialise the contest setup screen
	 * i.e. hook stuff up to the view
	 */
	var init = function () {
		/**
		 * private function
		 * initialises a list
		 * @param component The component type whose list will be initialised
		 */
		function initList(component) {
			// clist is controller list
			// vlist is view list
			// two sides of the same coin
			var clist, vlist;
			if (component === "brains") {
				clist = BRAIN_LIST;
				vlist = view.brain_list;
			} else {
				clist = WORLD_LIST;
				vlist = view.world_list
			}

			// when the user wants to add an item for use in the contest
			view.contest[component].on("add", function () {
				// go to the list's screen
				clist.go("c", true);

				// don't show any that are already selected
				for (var i = _contest[component].length - 1; i >= 0; i--) {
					clist.dontShowId(_contest[component][i]);
				}

				// refresh to shows the changes we just made
				clist.refresh();

				// when the user picks an item for use in the contest
				vlist.on("pick", function (id) {
					// if the item is not already in our list (this is a bit
					// an over-cautious sanity check)
					if (_contest[component].indexOf(id) === -1) {
						// add the item to the selected components list
						_contest[component].push(id);
						// tell the controller list not to display it anymore.
						clist.dontShowId(id, true, function () { go(); });
					}
				}, true);
			});

			// when the user wants to dismiss an item from the selected 
			// components list
			view.contest[component].on("dismiss", function (id) {
				// if the item is actually in the list (another over-cautious
				// sanity check)
				var i = _contest[component].indexOf(id);
				if (i > -1) {
					// remove the item and refresh the list
					_contest[component].splice(i, 1);
					_refreshList(component);
				}
			});
		}

		initList("brains");
		initList("worlds");

		// when the user is done and wants to start the contest
		view.contest.on("go", function () {
			CONTEST.go(_contest.brains, _contest.worlds);
		});
	};

	return {
		go: go,
		init: init
	};

})();
	