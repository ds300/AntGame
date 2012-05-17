var WORLD_EDIT = (function () {
	var _onCompile = function () {};

	var contest = false;

	var go = function (title, compileCallback, contestRules) {
		contest = contestRules;
		if (typeof compileCallback === "function") {
			_onCompile = compileCallback;
		} else {
			_onCompile = function () {};
		}
		if (typeof title !== "string") {
			title = "Edit";
		}
		view.edit.text("title", title + " World");
		view.edit.text("name", "");
		view.edit.text("code", "");
		view.edit.show();
	};

	var init = function () {
		view.edit.on("compile", function () { 
			try {
				var source = view.edit.text("code");
				model.parseAntWorld(source, contest);
				var world = {
					name: view.edit.text("name"),
					source: source,
					preset: false,
					thumb: view.getWorldThumbnail(source)
				};
				view.edit.hide();
				_onCompile(world);
			} catch (err) {
				window.alert(err.message);
			}
		});
		view.edit.on("cancel", function () {
			view.edit.hide();
		});
	};

	return {
		go: go,
		init: init
	}

})();