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
		view.brain_list.on("pick", function (id) {
			activeMatch[color + "_id"] = id;
			view.menu.trigger("goto_single_match");
		});
		refreshBrainList();
		brainListHighlight(activeMatch[color + "_id"]);
		view.menu.goto("sm_pick_brain");
	};
}

function brainListHighlight(id) {
	with (view.brain_list) {
		highlight(id);
		text("source", brains[id].source);
	}
}


$(document).ready(function () {
	//var activeMatch = Match(); 
	 	//activeContest = Contest();

	// setup initial view config
	view.init();
	with (view.menu) {
		goto("root");

		on("goto_root", function () {
			view.menu.goto("root");
		});

		on("goto_single_match", function () {
			view.menu.goto("single_match");
			view.single_match.text("red_name", brains[activeMatch.red_id].name);
			view.single_match.text("black_name", brains[activeMatch.black_id].name);
		});
	}


	with (view.single_match) {
		on("pick_red", getSMPickBrainCallback("red"));
		on("pick_black", getSMPickBrainCallback("black"));
	}
	
	var num_custom = 1;
	with (view.brain_list) {
		on("select", function (id) {
			brainListHighlight(id);
		});

		on("add", function () {
			view.brain_edit.text("title", "Add New Brain");
			view.brain_edit.text("name", "Custom Brain " + num_custom++);
			view.brain_edit.show();
		});

		on("delete", function (id, highlighted) {
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
	}

});

