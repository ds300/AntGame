/**
 * This is the component source/name editor
 */
var EDIT = (function () {

	/**
	 * opens the editor
	 */
	var go = function (title) {
		view.edit.text("title", title);
		view.edit.text("name", "");
		view.edit.text("code", "");
		view.edit.show();
	};

	/**
	 * initialises the editor
	 */
	var init = function () {
		// when the user wants to cancel
		view.edit.on("cancel", function () {
			view.edit.hide();
		});
		// when the user presses enter
		view.edit.on("enter_pressed", function () {
			view.edit.trigger("compile");
		});
	};

	return {
		go: go,
		init: init
	}

})();
