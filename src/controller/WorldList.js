/**
 * This controls the list of worlds that lets the user pick worlds to use in
 * matches or contests
 */
var WORLD_LIST = (function () {
	var contest = false;
	
	/**
	 * private function
	 * tries to compile the world
	 * @returns The compiled world on success, undefined on failure
	 */
	function _compileWorld() {
		try {
			var source = view.edit.text("code");
			var parsed = model.parseAntWorld(source, contest);
			var worldIsContestLegal = true;
			// if we're not specifically looking for a contest world, we still
			// need to check whether it is legal in case the user wants to use
			// it in a contest later
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
				thumb: view.game.gfx_utils.getWorldThumbnail(parsed)
			};
			view.edit.hide();
			return world;
		} catch (err) {
			window.alert(err.message);
		}
	}

	/**
	 * initialises the world list
	 * i.e. hooks it up to the view
	 */
	var init = function () {
		var that = this;

		// when the user clicks a world in the list
		view.world_list.on("select", function (id) {
			// show the thumbnail
			WORLDS[id] && view.world_list.thumb(WORLDS[id].thumb);
		});

		// when the user wants to add a new world
		view.world_list.on("add", function () {
			// show the edit dialog
			EDIT.go("Add New World");
			// when the user wants to compile their new world
			view.edit.on("compile", function () {
				// try to compile it
				var result = _compileWorld();
				// if success, add it to the list
				if (result) { that.add(result); }
			}, true);
		});

		var numWorldsGenerated = 0;
		// when the user wants to generate a random world
		view.world_list.on("generate", function () {
			// get the source
			var source = model.generateRandomWorld();
			// create the object
			var w = {
				name: "Random World " + (numWorldsGenerated++),
				preset: false,
				contest: true,
				source: source,
				thumb: view.game.gfx_utils.getWorldThumbnail(model.parseAntWorld(source))
			};
			// add to list
			that.add(w);
		});

		// when the user wants to edit a world
		view.world_list.on("edit", function (id) {
			// go to edit dialog
			EDIT.go("Edit World");
			// when the user wants to compile
			view.edit.on("compile", function () {
				// try to compile
				var result = _compileWorld();
				// if success
				if (result) {
					// change the world def
					WORLDS[id] = result;
					// refresh the list
					that.refresh();
				}
			}, true);
			// set the contents of the input fields
			view.edit.text("name", WORLDS[id].name);
			view.edit.text("code", WORLDS[id].source);
		});

		// when the user wants to delete a world
		view.world_list.on("delete", function (id) {
			// just delete it
			that.remove(id, function (highlighted) {
				// if they deleted the world already in use
				if (id === MATCH.worldId()) {
					// use the one that is highlighted now
					MATCH.worldId(highlighted);
				}
			});
		});
	};

	var handler = getListHandler("world_list", WORLDS, init);

	/**
	 * takes the user to the world list
	 * @param from The place where the user came from. Either 'sm' for single
	 *        match setup or 'c' for contest setup
	 */
	handler.go = function (from) {
		contest = from === "c";
		view.menu.goto(from + "_pick_world");
		this.showId("all");

		// if contest
		if (contest) {
			// exclude contest-illegal worlds
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