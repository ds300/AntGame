var buttonCallback = function (callback) {
	return function (evnt) {
		evnt && evnt.preventDefault();
		callback && callback();
	};
};

// gather main view elements
var elements = {};
elements["main_menu"] = $(".ag-menu");
elements["single_match_setup"] = $(".ag-singleMatch");




// gather event emitters
var eventers = {};
eventers["goto_main_menu"] = $(".ag-btn-menu");
eventers["goto_single_match"] = $(".ag-btn-singleMatch");
eventers["goto_contest"] = $(".ag-btn-contest");

exports.hideAll = function () {
	for (var elems in elements) {
		if (elements.hasOwnProperty(elems)) {
			elements[elems].hide();
		}
	}
	$("#ag-error").hide();
};

exports.hide = function (elemString) {
	elements[elemString] && elements[elemString].hide();
};

exports.show = function (elemString) {
	elements[elemString] && elements[elemString].show();
};

exports.on = function (evnt, callback) {
	eventers[evnt] && eventers[event].click(callback);
};

exports.error = function (header, body, onClose) {
	$("#ag-error-header").html(header);
	$("#ag-error-body").html(body);
	$("#ag-error").on("hide", onClose);
	$("#ag-error").modal("show");
};