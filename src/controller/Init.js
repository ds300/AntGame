var brains = [];

brains.push({
	name: "Chealsea",
	preset: true,
	source: 
		"Flip 1 6 1" + "\n" +
		"Flip 6 2 2" + "\n" +
		"Flip 5 2 3" + "\n" +
		"Flip 4 9 4" + "\n" +
		"Flip 3 1 5" + "\n" +
		"Flip 2 1 2" + "\n" +
		"Flip 2 7 8" + "\n" +
		"Turn Left 0" + "\n" +
		"Turn Right 0"
});

brains.push({
	name: "Bolton Wanderers from the north coast of the citadel",
	preset: true,
	source: 
		"Flip 1 6 1" + "\n" +
		"Flip 6 2 2" + "\n" +
		"Flip 5 2 3" + "\n" +
		"Flip 4 9 4" + "\n" +
		"Flip 3 1 5" + "\n" +
		"Flip 2 1 2" + "\n" +
		"Flip 2 7 8" + "\n" +
		"Flip 2 7 8" + "\n" +
		"Turn Left 0" + "\n" +
		"Turn Right 0"
});

brains.push({
	name: "Civic Duty",
	preset: true,
	source: 
		"Flip 1 6 1" + "\n" +
		"Flip 6 2 2" + "\n" +
		"Flip 5 2 3" + "\n" +
		"Flip 4 9 4" + "\n" +
		"Flip 3 1 5" + "\n" +
		"Flip 2 1 2" + "\n" +
		"Flip 2 7 8" + "\n" +
		"Flip 2 7 8" + "\n" +
		"Turn Left 0" + "\n" +
		"Turn Right 0"
});

var activeMatch = {
	red_id: 0,
	black_id: 1,

}

function refreshBrainList() {
	view.brain_list.clear();
	for (var i = brains.length-1; i >= 0; i--) {
		view.brain_list.add(brains[i].name,i,brains[i].preset);
	}
}

function getSMPickBrainCallback(color) {
	return function () {
		view.on("brain_list_pick", function (id) {
			activeMatch[color + "_id"] = id;
			view.trigger("goto_single_match");
		});
		refreshBrainList();
		brainListHighlight(activeMatch[color + "_id"]);
		view.goto("sm_pick_brain");
	};
}

function brainListHighlight(id) {
	view.brain_list.highlight(id);
	view.text("brain_list_source", brains[id].source);
}


$(document).ready(function () {
	//var activeMatch = Match(); 
	 	//activeContest = Contest();

	// setup initial view config
	view.init();
	view.goto("root");

	// setup nav buttons
	view.on("goto_main_menu", function () {
		view.goto("root");
	});

	view.on("goto_single_match", function () {
		view.goto("single_match");
		view.text("sm_brain_red", brains[activeMatch.red_id].name);
		view.text("sm_brain_black", brains[activeMatch.black_id].name);
	});

	view.on("sm_pick_red_brain", getSMPickBrainCallback("red"));
	view.on("sm_pick_black_brain", getSMPickBrainCallback("black"));

	view.on("brain_list_select", function (id) {
		brainListHighlight(id);
	});

	view.on("brain_list_add", function () {
		view.text("brain_edit_title", "Add New Brain");
		view.text("brain_edit_name", "Custom Brain " + (brains.length - 2));
		view.brain_edit.show();
	});

	view.on("brain_list_delete", function (id, highlighted) {
		brains.splice(id, 1);
		refreshBrainList();
		if (id <= highlighted) {
			highlighted--;
		}
		if (id === activeMatch.red_id) {
			activeMatch.red_id = highlighted;
		}
		if (id === activeMatch.black_id) {
			activeMatch.black_id = highlighted;
		}
		brainListHighlight(highlighted);
	});

	view.on("brain_edit_close", function () {
		view.brain_edit.hide();
	});

});

