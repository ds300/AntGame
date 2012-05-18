var EDIT = (function () {

	var go = function (title) {
		view.edit.text("title", title);
		view.edit.text("name", "");
		view.edit.text("code", "");
		view.edit.show();
	};

	var init = function () {
		view.edit.on("cancel", function () {
			view.edit.hide();
		});
	};

	return {
		go: go,
		init: init
	}

})();