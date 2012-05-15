var elements = {},
    eventers = {},
    errorModal,
    visToggle;

var locations = {
	root: {
		prerequisites: [],
		description: "Main Menu",
		selector: ".ag-root"
	},
	single_match: {
		prerequisites: ["root"],
		description: "Single Match",
		selector: ".ag-sm"
	},
	sm_pick_brain: {
		prerequisites: ["root","single_match"],
		description: "Pick Brain",
		selector: ".ag-sm-pick-brain"
	}
}

exports.goto = function (location) {
	// if the location exists
	if (locations[location]) {
		// hide all others
		for (var loc in locations) {
			if (locations.hasOwnProperty(loc)) {
				var s = locations[loc].selector;
				$(s + ", " + s + "-bc").hide();	
			}
		}
	}
	$(locations[location].selector).show();
	// construct breadcrumb trail
	var preq = locations[location].prerequisites;
	for (var i = 0, len = preq.length; i < len; i++) {
		var s = locations[preq[i]].selector;
		$(s + "-bc").show();
	}
}

exports.init = function () {
	// main menu elements
	$("#loading-bg").hide();

	visToggle = $(".ag-vis-toggle");

	visToggle.html("with");

	visToggle.click(function () {
		var withVis = visToggle.html() === "with";
		visToggle.removeClass(!withVis ? "btn-danger" : "btn-warning");
		visToggle.addClass(!withVis ? "btn-warning" : "btn-danger");
		visToggle.html(withVis ? "without" : "with");
	});

	// static event emitting elements
	eventers["goto_main_menu"] = $(".ag-btn-root");
	eventers["goto_single_match"] = $(".ag-btn-sm");
	eventers["goto_contest"] = $(".ag-btn-contest");
	eventers["sm_pick_red_brain"] = $("#ag-sm-pick-red");
	eventers["sm_pick_black_brain"] = $("#ag-sm-pick-black");
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