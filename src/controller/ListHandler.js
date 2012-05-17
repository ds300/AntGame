function getListHandler(list, resources) {
	var _highlighted = 0;

	var highlight = function (id) {
		view[list].highlight(id);
		_highlighted = id;
	};

	var _excludes = [];

	var refresh = function () {
		view[list].clear();
		for (var i = resources.length - 1; i >= 0; i--) {
			if (_excludes.indexOf(i) === -1) {
				view[list].add(resources[i].name, i, resources[i].preset);
			}
		}
		highlight(_highlighted);
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

	return {
		_highlighted: function (val) {
			if (typeof val === "number") {
				_highlighted = val;
			} else {
				return _highlighted;
			}
		},
		highlight: highlight,
		dontShowId: dontShowId,
		showId: showId,
		refresh: refresh
	};
}