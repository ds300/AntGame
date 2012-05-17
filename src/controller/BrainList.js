var BRAIN_LIST = (function () {
	var _highlighted = 0;

	var highlight = function (id) {
		view.brain_list.highlight(id);
		view.brain_list.text("source", BRAINS[id].source);
		_highlighted = id;
	};

	var init = function () {
		view.brain_list.on("select", function (id) {
			highlight(id);
		});

		view.brain_list.on("add", function () {
			BRAIN_EDIT.go("Add New", function (result) {
				BRAINS.push(result);
				refresh();
			});
		});

		view.brain_list.on("edit", function (id) {
			BRAIN_EDIT.go("Edit", function (result) {
				BRAINS[id] = result;
				refresh();
			});
			view.brain_edit.text("name", BRAINS[id].name);
			view.brain_edit.text("code", BRAINS[id].source);
		});

		view.brain_list.on("delete", function (id) {
			BRAINS.splice(id, 1);
			
			if (id <= _highlighted) {
				do { 
					_highlighted--; 
				} while (_highlighted >= 0 && _excludes.indexOf(_highlighted) !== -1);
			}
			if (id === MATCH.redId()) {
				MATCH.redId(_highlighted);
			}
			if (id === MATCH.blackId()) {
				MATCH.blackId(_highlighted);
			}
			refresh();
		});
	};

	var _excludes = [];

	var refresh = function () {
		view.brain_list.clear();
		for (var i = BRAINS.length - 1; i >= 0; i--) {
			if (_excludes.indexOf(i) === -1) {
				view.brain_list.add(BRAINS[i].name, i, BRAINS[i].preset);
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
		highlight: highlight,
		init: init,
		dontShowId: dontShowId,
		showId: showId,
		refresh: refresh
	};
})();