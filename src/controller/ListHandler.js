/**
 * This function returns an object which handles the display of either the
 * brain or world list.
 * @param list The type of list. Either "brains" or "worlds".
 * @param resources The array of items which will be coupled with the list
 * @param initCallback A function to be called when the handler is initialised
 * @returns the handler
 */
function getListHandler(list, resources, initCallback) {
	var _highlighted = 0; // the id of the currently-highlighted item

	var _excludes = []; // ids of items not to show

	/**
	 * refreshes the list
	 */
	var refresh = function () {
		// if there's nothing to be shown
		if (_excludes.length === resources.length) {
			view[list].sayEmpty();

		} else {
			view[list].clear();
			// add items
			for (var i = 0, len = resources.length; i < len; i++) {
				if (_excludes.indexOf(i) === -1) {
					view[list].add(resources[i].name, i, resources[i].preset);
				}
			}
			// select currently highlighted item
			view[list].trigger("select", [_highlighted]);
		}
	};

	/**
	 * adds an item to the list
	 * @param obj The item to be added
	 */
	var add = function (obj) {
		resources.push(obj);
		// highlight this one
		_highlighted = resources.length - 1;
		refresh();
	};

	/**
	 * removes an item from the list
	 * @param id The id of the item to remove
	 * @param callback Removal of items from a list might be troublesome for
	 *        situations where that item is being used somewhere, so this
	 *        callback is called with the id of the item which is highlighted
	 *        after removal.
	 */
	var remove = function (id, callback) {
		// remove the item from the resources list
		resources.splice(id, 1);

		// if we need to change the id of whichever item was highlighted
		if (id <= _highlighted) {
			do { 
				_highlighted--; 
			// while there are still items to be highlighted
			} while (_highlighted >= 0 && _excludes.indexOf(_highlighted) !== -1);
		}
		refresh();
		if (typeof callback === "function") { callback(_highlighted); }
	};

	/**
	 * excludes a particular id from being shown in the list, but doesn't
	 * delete it from the resources
	 * @param id The id of the item to exclude
	 * @param reload whether or not to update the view after the item has
	 *        been excluded
	 * @param onEmpty A function to call if this exclude resulted in there
	 *        being no items to display.
	 */
	var dontShowId = function (id, reload, onEmpty) {
		// if this id is not already being excluded
		if (_excludes.indexOf(id) === -1) {
			_excludes.push(id);
			// if there's nothing to display
			if (_excludes.length === resources.length &&
				typeof onEmpty === "function") {
				onEmpty();
			// else if we need to highlight a new item
			} else if (id === _highlighted) {
				do { 
					_highlighted--; 
				} while (_highlighted >= 0 && _excludes.indexOf(_highlighted) !== -1);
				// if we didn't find anything to highlight by decrementing
				if (_highlighted === -1) {
					// start again but increment
					_highlighted = id;
					do {
						_highlighted++
					} while (_highlighted < resources.length && _excludes.indexOf(_highlighted) !== -1)
				}
				// select the newly highlighted thing
				view[list].trigger("select", [_highlighted]);
			}
			if (reload) { refresh(); }
		}
	};

	/**
	 * unexcludes an id, or all ids
	 * @param id The id of the item to unexclude, or "all" to show everything
	 */
	var showId = function (id) {
		if (id === "all") {
			_excludes = [];
			refresh();
		} else if (_excludes.indexOf(id) > -1) {
			_excludes.splice(_excludes.indexOf(id), 1);
			refresh();
		}
	};

	/**
	 * initialises the list handler
	 * i.e. hooks it up to the view
	 */
	var init = function () {
		// when the user clicks on a list item
		view[list].on("select", function (id) {
			// highlight it
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
