var BRAIN_LIST = (function () {
	var handler = getListHandler("brain_list", BRAINS);
	handler.init = function () {
		var that = this;
		view.brain_list.on("select", function (id) {
			that.highlight(id);
			view.brain_list.text("source", BRAINS[id].source);
		});

		view.brain_list.on("add", function () {
			BRAIN_EDIT.go("Add New", function (result) {
				if (result.name.trim() === "") {
					result.name = "Untitiled Brain";
				}
				BRAINS.push(result);
				that.refresh();
			});
		});

		view.brain_list.on("edit", function (id) {
			BRAIN_EDIT.go("Edit", function (result) {
				BRAINS[id] = result;
				that.refresh();
			});
			view.edit.text("name", BRAINS[id].name);
			view.edit.text("code", BRAINS[id].source);
		});

		view.brain_list.on("delete", function (id) {
			BRAINS.splice(id, 1);

			var h = that._highlighted();
			
			if (id <= h) {
				do { 
					that._highlighted(--h); 
				} while (h >= 0 && _excludes.indexOf(h) !== -1);
			}
			if (id === MATCH.redId()) {
				MATCH.redId(h);
			}
			if (id === MATCH.blackId()) {
				MATCH.blackId(h);
			}
			that.refresh();
		});
	};
	return handler;
})();