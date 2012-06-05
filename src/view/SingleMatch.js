var LogicalGroup = LogicalGroup || function () {};
/**
 * This provides an access layer to the dynamic elements which constitute 
 * the single match setup screen, and also the single match results dialog
 */
(function () {

var events = [
	{
		// The button which lets the user pick the red brain
		name: "pick_red",
		binder: function (callback) {
			$("#ag-sm-pick-red").click(callback);
		}
	},
	{
		// The button which lets the user pick the black brain
		name: "pick_black",
		binder: function (callback) {
			$("#ag-sm-pick-black").click(callback);
		}
	},
	{
		// The button which lets the user pick the world
		name: "pick_world",
		binder: function (callback) {
			$("#ag-sm-pick-world").click(callback);
		}
	},
	{
		// triggered when the text in the number of rounds input field changes
		name: "rounds_change",
		binder: function (callback) {
			$("#ag-sm-rounds").change(function () {
				callback($("#ag-sm-rounds").attr("value"));
			});
		}
	},
	{
		// the button to start the game
		name: "go",
		binder: function (callback) {
			$("#ag-sm-run").click(callback);
		}
	},
	{
		// the button to toggle graphics off
		name: "vis_off",
		binder: function (callback) {
			$(".ag-vis-on").click(function () {
				$(".ag-vis-on").hide();
				$(".ag-vis-off").show();
				callback("off");
			});
		}
	},
	{
		// the button to toggle graphics on
		name: "vis_on",
		binder: function (callback) {
			$(".ag-vis-off").click(function () {
				$(".ag-vis-off").hide();
				$(".ag-vis-on").show();
				callback("on");
			});
		}
	},
	{
		// triggered when the results dialog is closed
		name: "results_close",
		binder: function (callback) {
			$("#ag-sm-results").on("hide", callback);
		}
	}
];

var textElems = {
	// the name of the currently chosen red team
	red_name: {
		get: function () { return $("#ag-sm-red-name").text(); },
		set: function (text) {
			$("#ag-sm-red-name").text(text); 
			$("#ag-sm-results-red-name").text(text); 
		}
	},
	// the name of the currently chosen black team
	black_name: {
		get: function () { return $("#ag-sm-black-name").text(); },
		set: function (text) {
			$("#ag-sm-black-name").text(text);
			$("#ag-sm-results-black-name").text(text);
		}
	},
	// the name of the currently chosen world
	world_name: {
		get: function () { return $("#ag-sm-world-name").text(); },
		set: function (text) { 
			$("#ag-sm-world-name").text(text); 
		}
	},
	// the number of rounds as specified in the input field
	rounds: {
		get: function () { return $("#ag-sm-rounds").attr("value"); },
		set: function (text) { $("#ag-sm-rounds").attr("value", text); }
	},
	// how many food particles the red team managed to gather
	results_red_food: {
		get: function () {},
		set: function (text) { $("#ag-sm-results-red-food").text(text); }
	},
	// how many food particles the black team managed to gather
	results_black_food: {
		get: function () {},
		set: function (text) { $("#ag-sm-results-black-food").text(text); }
	},
	// how many members of the red team died
	results_red_deaths: {
		get: function () {},
		set: function (text) { $("#ag-sm-results-red-deaths").text(text); }
	},
	// how many members of the black team died
	results_black_deaths: {
		get: function () {},
		set: function (text) { $("#ag-sm-results-black-deaths").text(text); }
	}

};

exports.single_match = new LogicalGroup(events, textElems);

/**
 * shows the results dialog
 * @param results The results of a single match
 */
exports.single_match.showResults = function (results) {
	console.log(results);
	this.text("results_red_food", "" + results.red.food);
	this.text("results_black_food", "" + results.black.food);
	this.text("results_red_deaths", "" + results.red.deaths);
	this.text("results_black_deaths", "" + results.black.deaths);
	$("#ag-sm-results").modal("show");
};

})();
