var WORLD_LIST = (function () {
	var handler = getListHandler("world_list", WORLDS);
	handler.init = function () {
		var that = this;
		view.world_list.on("select", function (id) {
			that.highlight(id);
			// thumbnail shit
		});

		view.world_list.on("add", function () {
			console.log("monkey?");
			WORLD_EDIT.go("Add New", function (result) {
				if (result.name.trim() === "") {
					result.name = "Untitiled World";
				}
				WORLDS.push(result);
				that.refresh();
			});
		});

		view.world_list.on("edit", function (id) {
			WORLD_EDIT.go("Edit", function (result) {
				WORLDS[id] = result;
				that.refresh();
			});
			view.edit.text("name", WORLDS[id].name);
			view.edit.text("code", WORLDS[id].source);
		});

		view.world_list.on("delete", function (id) {
			WORLDS.splice(id, 1);

			var h = that._highlighted();
			
			if (id <= h) {
				do { 
					that._highlighted(--h); 
				} while (h >= 0 && _excludes.indexOf(h) !== -1);
			}
			if (id === MATCH.worldId()) {
				MATCH.worldId(h);
			}
			that.refresh();
		});
	};
	return handler;
})();