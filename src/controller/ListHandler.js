function getListHandler(list, resources, initCallback) {
	var _highlighted = 0;

	var _excludes = [];

	var refresh = function () {
		if (_excludes.length === resources.length) {
			view[list].sayEmpty();
			console.log("_excludes", _excludes);
			console.log("resources", resources);
			return;
		}
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
		_highlighted = resources.length - 1;
		refresh();
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


	var dontShowId = function (id, reload, onEmpty) {
		if (_excludes.indexOf(id) === -1) {
			_excludes.push(id);
			if (_excludes.length === resources.length &&
				typeof onEmpty === "function") {
				onEmpty();
			} else if (id === _highlighted) {
				do { 
					_highlighted--; 
				} while (_highlighted >= 0 && _excludes.indexOf(_highlighted) !== -1);
				if (_highlighted === -1) {
					_highlighted = id;
					do {
						_highlighted++
					} while (_highlighted < resources.length && _excludes.indexOf(_highlighted) !== -1)
				}
				view[list].trigger("select", [_highlighted]);
			}
			if (reload) { refresh(); }
		}
	};

	var showId = function (id) {
		console.log("trying to reshow id",id);
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