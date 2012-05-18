function getListHandler(list, resources, initCallback) {
	var _highlighted = 0;

	var _excludes = [];

	var refresh = function () {
		view[list].clear();
		for (var i = 0, len = resources.length; i < len; i++) {
			if (_excludes.indexOf(i) === -1) {
				view[list].add(resources[i].name, i, resources[i].preset);
			}
		}
		view[list].trigger("select", [_highlighted]);
	};

	var add = function (obj) {
		resources.push(obj);
		var i = resources.length - 1;
		view[list].add(resources[i].name, i , resources[i].preset);
		view[list].trigger("select", [i]);
	};

	// return new highlighted
	var remove = function (id, callback) {
		resources.splice(id, 1);
		if (id <= _highlighted) {
			do { 
				_highlighted--; 
			} while (_highlighted >= 0 && _excludes.indexOf(_highlighted) !== -1);
		}
		refresh();
		if (typeof callback === "function") { callback(_highlighted); }
	};

	var dontShowId = function (id, reload) {
		if (_excludes.indexOf(id) === -1) {
			_excludes.push(id);
			if (reload) { refresh(); }
		}
	};

	var showId = function (id) {
		if (id === "all") {
			_excludes = [];
			refresh();
		} else if (_excludes.indexOf(id) > -1) {
			_excludes.splice(_excludes.indexOf(id), 1);
			refresh();
		}
	};

	var init = function () {
		view[list].on("select", function (id) {
			view[list].highlight(id);
			_highlighted = id;
		});

		if (typeof initCallback === "function") { initCallback.apply(this); }
	};

	return {
		add: add,
		remove: remove,
		dontShowId: dontShowId,
		init: init,
		showId: showId,
		refresh: refresh
	};
}