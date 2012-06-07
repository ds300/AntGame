var LogicalGroup = LogicalGroup || function () {};

(function () {
	
var events = [
	{
		// any button which takes the user to the root of the main menu
		name: "goto_root",
		binder: function (callback) {
			$(".ag-btn-root").click(callback);
		}
	},
	{
		// any button which takes the user to the single match setup screen
		name: "goto_single_match",
		binder: function (callback) {
			$(".ag-btn-sm").click(callback);
		}
	},
	{
		// any button which takes the user to the contest setup screen
		name: "goto_contest",
		binder: function (callback) {
			$(".ag-btn-contest").click(callback);
		}
	}
];

exports.menu = new LogicalGroup(events, {});

// these 'locations' are used to show and hide DOM elements in accordance with
// when they should be shown and hidden.
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
	run_sans: {
		prerequisites: [],
		description: "Run Without Graphics",
		selector: ".ag-run-sans"
	},
	run: {
		prerequisites: [],
		description: "Run With Graphics",
		selector: ".ag-run"
	},
	contest_setup: {
		prerequisites: ["root"],
		description: "Contest Setup",
		selector: ".ag-c"
	},
	contest: {
		prerequisites: ["root"],
		description: "Contest",
		selector: ".ag-cstats"
	},
	sm_pick_brain: {
		prerequisites: ["root","single_match"],
		description: "Pick Brain",
		selector: ".ag-bl"
	},
	sm_pick_world: {
		prerequisites: ["root","single_match"],
		description: "Pick World",
		selector: ".ag-wl"
	},
	c_pick_brain: {
		prerequisites: ["root","contest_setup"],
		description: "Pick Brains",
		selector: ".ag-bl"
	},
	c_pick_world: {
		prerequisites: ["root","contest_setup"],
		description: "Pick Worlds",
		selector: ".ag-wl"
	}
};

/**
 * navigates to the specified menu location
 * @param location The location
 */
exports.menu.goto = function (location) {
	// if the location exists
	if (locations[location]) {
		// hide everything
		for (var loc in locations) {
			if (locations.hasOwnProperty(loc)) {
				var s = locations[loc].selector;
				$(s + ", " + s + "-bc").hide();	
			}
		}
	}
	// show this location
	$(locations[location].selector).show();
	// construct breadcrumb trail
	var preq = locations[location].prerequisites;
	for (var i = 0, len = preq.length; i < len; i++) {
		var s = locations[preq[i]].selector;
		$(s + "-bc").show();
	}
};

/**
 * hides the navigation stuff
 */
exports.menu.hideBreadcrumbs = function () {
	$("#ag-bread").hide();
	$("#ag-navbar").hide();
};

/**
 * shows the navigation stuff 
 */
exports.menu.showBreadcrumbs = function () {
	$("#ag-bread").show();
	$("#ag-navbar").show();
};


})();
