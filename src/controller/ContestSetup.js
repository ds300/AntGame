var CONTEST_SETUP = (function () {

	// this holds the metadata for the contest to be run
	var _contest = {
		brains: [],
		worlds: [],
		game: null,
		vis: true
	};

	var go = function () {
		view.menu.goto("contest");
		_refreshList("brains");
		_refreshList("worlds");
	};

	function _refreshList(component) {
		if (_contest[component].length === 0) {
			view.contest[component].sayEmpty();
			return;
		}

		var resources = component === "brains" ? BRAINS : WORLDS;
		var v = view.contest[component];
		v.clear();
		for (var i = _contest[component].length - 1; i >= 0; i--) {
			var id = _contest[component][i];
			v.add(resources[id].name, id);
		};
	}

	var init = function () {
		// hook up things

		function initList(component) {
			var clist, vlist;
			if (component === "brains") {
				clist = BRAIN_LIST;
				vlist = view.brain_list;
			} else {
				clist = WORLD_LIST;
				vlist = view.world_list
			}
			view.contest[component].on("add", function () {
				clist.go("c", true);
				for (var i = _contest[component].length - 1; i >= 0; i--) {
					clist.dontShowId(_contest[component][i]);
				}
				clist.refresh();
				vlist.on("pick", function (id) {
					if (_contest[component].indexOf(id) === -1) {
						_contest[component].push(id);
						clist.dontShowId(id, true, function () { go(); });
					}
				}, true);
			});

			view.contest[component].on("dismiss", function (id) {
				var i = _contest[component].indexOf(id);
				if (i > -1) {
					_contest[component].splice(i, 1);
					_refreshList(component);
				}
			});
		}

		initList("brains");
		initList("worlds");
	};

	return {
		go: go,
		init: init
	};

})();
	