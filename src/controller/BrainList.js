var BRAIN_LIST = (function () {

	function _compileBrain() {
		try {
			var source = view.edit.text("code");
			model.parseAntBrain(source);
			var brain = {
				name: view.edit.text("name").trim() || "Untitled Brain",
				source: source,
				preset: false
			};
			view.edit.hide();
			return brain;
		} catch (err) {
			window.alert(err.message);
		}
	}

	var init = function () {
		var that = this;
		view.brain_list.on("select", function (id) {
			view.brain_list.text("source", BRAINS[id].source);
		});

		

		view.brain_list.on("add", function () {
			EDIT.go("Add New Brain");
			view.edit.on("compile", function () { 
				var result = _compileBrain();
				if (result) { that.add(result); }
			}, true);
		}); 

		view.brain_list.on("edit", function (id) {
			EDIT.go("Edit Brain");
			view.edit.text("name", BRAINS[id].name);
			view.edit.text("code", BRAINS[id].source);
			view.edit.on("compile", function () { 
				var result = _compileBrain();
				if (result) { 
					BRAINS[id] = result;
					that.refresh();
				}
			}, true);
		});

		view.brain_list.on("delete", function (id) {
			that.remove(id, function (highlighted) {
				if (id === MATCH.redId()) {
					MATCH.redId(highlighted);
				}
				if (id === MATCH.blackId()) {
					MATCH.blackId(highlighted);
				}
			});
		});
	};
	var handler =  getListHandler("brain_list", BRAINS, init);

	handler.go = function (from) {
		view.menu.goto(from + "_pick_brain");
	};

	return handler;
})();