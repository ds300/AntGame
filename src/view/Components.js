var elements = {},
    eventers = {},
    errorModal,
    visToggle;

exports.init = function () {
	// main menu elements
	elements["main_menu"] = $(".ag-menu");
	elements["single_match_setup"] = $(".ag-singleMatch");

	errorModal = $("#ag-error");
	errorModal.modal();

	visToggle = $(".ag-vis-toggle");

	visToggle.html("with");

	visToggle.click(function () {
		var withVis = visToggle.html() === "with";
		visToggle.removeClass(!withVis ? "btn-danger" : "btn-warning");
		visToggle.addClass(!withVis ? "btn-warning" : "btn-danger");
		visToggle.html(withVis ? "without" : "with");
	});

	// event emitting elements
	eventers["goto_main_menu"] = $(".ag-btn-menu");
	eventers["goto_single_match"] = $(".ag-btn-singleMatch");
	eventers["goto_contest"] = $(".ag-btn-contest");
};

var buttonCallback = function (callback) {
	return function (evnt) {
		evnt && evnt.preventDefault();
		callback && callback();
	};
};

exports.hideAll = function () {
	for (var elems in elements) {
		if (elements.hasOwnProperty(elems)) {
			elements[elems].hide();
		}
	}
	errorModal.modal("hide");
	$("#loading-bg").hide();
};



exports.hide = function (elemString) {
	elements[elemString] && elements[elemString].hide();
};

exports.show = function (elemString) {
	elements[elemString] && elements[elemString].show();
};

exports.on = function (evnt, callback) {
	eventers[evnt] && eventers[evnt].click(callback);
};

exports.error = function (header, body, onClose) {
	$("#ag-error-header").html(header);
	$("#ag-error-body").html(body);
	errorModal.on("hide", onClose);
	errorModal.modal("show");
};