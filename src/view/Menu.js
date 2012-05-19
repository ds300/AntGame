var LogicalGroup = LogicalGroup || function () {};

(function () {
	
var events = [
	{
		name: "goto_root",
		binder: function (callback) {
			$(".ag-btn-root").click(callback);
		}
	},
	{
		name: "goto_single_match",
		binder: function (callback) {
			$(".ag-btn-sm").click(callback);
		}
	},
	{
		name: "goto_contest",
		binder: function (callback) {
			$(".ag-btn-contest").click(callback);
		}
	},
];

exports.menu = new LogicalGroup(events, {});

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


})();