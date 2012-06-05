/**
 * This controls the list of brains which the user can use in matches and
 * contests
 */
var BRAIN_LIST = (function () {

	/**
	 * private function
	 * attempts to compile a brain from source code
	 * @returns an object representing the brain
	 */
	function _compileBrain() {
		try {
			var source = view.edit.text("code");
			// this next like will throw the error if badness happens
			model.parseAntBrain(source);
			var brain = {
				name: view.edit.text("name").trim() || "Untitled Brain",
				source: source,
				preset: false
			};
			view.edit.hide();
			return brain;
		} catch (err) {
			// just tell the user what the error was
			window.alert(err.message);
		}
	}

	/**
	 * initialises the brain list.
	 * i.e. hooks into the view component, setting up what to do when events
	 * occur and the like
	 */
	var init = function () {
		var that = this;

		// when a list item is clicked on
		view.brain_list.on("select", function (id) {
			// show its source code
			var text = !!BRAINS[id] ? BRAINS[id].source : "";
			view.brain_list.text("source", text);
		});

		// when the user wants to add a new brain
		view.brain_list.on("add", function () {
			// go to edit dialog
			EDIT.go("Add New Brain");
			// when the user has finished and wants to compile
			view.edit.on("compile", function () { 
				// try to compile
				var result = _compileBrain();
				// if successful, add it to the list
				if (result) { that.add(result); }
			}, true);
		}); 

		// when the user wants to edit a brain
		view.brain_list.on("edit", function (id) {
			// go to edit dialog
			EDIT.go("Edit Brain");
			// set input field values
			view.edit.text("name", BRAINS[id].name);
			view.edit.text("code", BRAINS[id].source);
			// when the user has finished and wants to compile
			view.edit.on("compile", function () { 
				// try to compile
				var result = _compileBrain();
				if (result) { 
					// if successful, change the brain definition
					BRAINS[id] = result;
					// trigger display update
					that.refresh();
				}
			}, true);
		});

		// when the user wants to delete a brain
		view.brain_list.on("delete", function (id) {
			// just delete the brain.
			that.remove(id, function (highlighted) {
				// if a brain that was selected for a match was delted,
				// we need to update the match object according to which
				// brain is now highlighted in the list.
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

	/**
	 * takes the user to the brain list
	 * @param from The place where the user came from. Either 'sm' for single
	 *        match or 'c' for contest.
	 */	
	handler.go = function (from) {
		view.menu.goto(from + "_pick_brain");
		this.showId("all");
	};

	return handler;
})();