var WORLD_LIST = (function () {
	var contest = false;
	
	function _compileWorld() {
		try {
			var source = view.edit.text("code");
			var parsed = model.parseAntWorld(source, contest);
			var worldIsContestLegal = true;
			if (!contest) {
				try {
					model.parseAntWorld(source, true);
				} catch (err) {
					worldIsContestLegal = false;
				}
			}
			var world = {
				name: view.edit.text("name").trim() || "Untitled World",
				source: source,
				preset: false,
				contest: worldIsContestLegal,
				thumb: view.getWorldThumbnail(parsed)
			};
			view.edit.hide();
			return world;
		} catch (err) {
			window.alert(err.message);
		}
	}

	var init = function () {
		var that = this;

		view.world_list.on("select", function (id) {
			WORLDS[id] && view.world_list.thumb(WORLDS[id].thumb);
		});

		view.world_list.on("add", function () {
			EDIT.go("Add New World");
			view.edit.on("compile", function () {
				var result = _compileWorld();
				if (result) { that.add(result); }
			}, true);
		});

		var numWorldsGenerated = 0;
		view.world_list.on("generate", function () {
			var source = model.generateRandomWorld();
			var w = {
				name: "Random World " + (numWorldsGenerated++),
				preset: false,
				contest: true,
				source: source,
				thumb: view.getWorldThumbnail(model.parseAntWorld(source))
			};
			that.add(w);
		});

		view.world_list.on("edit", function (id) {
			EDIT.go("Edit World");
			view.edit.on("compile", function () {
				var result = _compileWorld();
				if (result) {
					WORLDS[id] = result;
					that.refresh();
				}
			}, true);
			view.edit.text("name", WORLDS[id].name);
			view.edit.text("code", WORLDS[id].source);
		});

		view.world_list.on("delete", function (id) {
			that.remove(id, function (highlighted) {
				if (id === MATCH.worldId()) {
					MATCH.worldId(highlighted);
				}
			});
		});
	};

	var handler = getListHandler("world_list", WORLDS, init);
	handler.go = function (from) {
		contest = from === "c";
		view.menu.goto(from + "_pick_world");
		this.showId("all");

		if (contest) {
			for (var i = WORLDS.length - 1; i >= 0; i--) {
				if (WORLDS[i].contest === false) {
					this.dontShowId(i);
				}
			}
		}

		this.refresh();
	};

	return handler;
	
})();