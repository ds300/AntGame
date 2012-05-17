var BRAIN_EDIT = (function () {
	var _onCompile = function () {};

	var go = function (title, compileCallback) {
		if (typeof compileCallback === "function") {
			_onCompile = compileCallback;
		} else {
			_onCompile = function () {};
		}
		if (typeof title !== "string") {
			title = "Edit";
		}
		view.brain_edit.text("title", title + " Brain");
		view.brain_edit.text("name", "");
		view.brain_edit.text("code", "");
		view.brain_edit.show();
	};

	var init = function () {
		view.brain_edit.on("compile", function () { 
			try {
				model.parseAntBrain(view.brain_edit.text("code"));
				var brain = {
					name: view.brain_edit.text("name"),
					source: view.brain_edit.text("code"),
					preset: false
				};
				view.brain_edit.hide();
				_onCompile(brain);
			} catch (err) {
				window.alert(err.message);
			}
		});
		view.brain_edit.on("cancel", function () {
			view.brain_edit.hide();
		});
	};

	return {
		go: go,
		init: init
	}

})();