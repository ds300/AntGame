var BRAIN_LIST = (function () {
	var highlight = function (id) {
		view.brain_list.highlight(id);
		view.brain_list.text("source", BRAINS[id].source);
	};


})();