var LogicalGroup = LogicalGroup || function () {};

(function () {

var events = [
	{
		name: "pick_red",
		binder: function (callback) {
			$("#ag-sm-pick-red").click(callback);
		}
	},
	{
		name: "pick_black",
		binder: function (callback) {
			$("#ag-sm-pick-black").click(callback);
		}
	},
	{
		name: "pick_world",
		binder: function (callback) {
			$("#ag-sm-pick-world").click(callback);
		}
	},
	{
		name: "rounds_change",
		binder: function (callback) {
			$("#ag-sm-rounds").change(function () {
				callback($("#ag-sm-rounds").attr("value"));
			});
		}
	},
	{
		name: "go",
		binder: function (callback) {
			$("#ag-sm-run").click(callback);
		}
	},
	{
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
		name: "results_close",
		binder: function (callback) {
			$("#ag-sm-results").on("hide", callback);
		}
	}
];

var textElems = {
	red_name: {
		get: function () { return $("#ag-sm-red-name").text(); },
		set: function (text) {
			$("#ag-sm-red-name").text(text); 
			$("#ag-sm-results-red-name").text(text); 
		}
	},
	black_name: {
		get: function () { return $("#ag-sm-black-name").text(); },
		set: function (text) {
			$("#ag-sm-black-name").text(text);
			$("#ag-sm-results-black-name").text(text);
		}
	},
	world_name: {
		get: function () { return $("#ag-sm-world-name").text(); },
		set: function (text) { 
			$("#ag-sm-world-name").text(text); 
		}
	},
	rounds: {
		get: function () { return $("#ag-sm-rounds").attr("value"); },
		set: function (text) { $("#ag-sm-rounds").attr("value", text); }
	},
	results_red_food: {
		get: function () {},
		set: function (text) { $("#ag-sm-results-red-food").text(text); }
	},
	results_black_food: {
		get: function () {},
		set: function (text) { $("#ag-sm-results-black-food").text(text); }
	},
	results_red_deaths: {
		get: function () {},
		set: function (text) { $("#ag-sm-results-red-deaths").text(text); }
	},
	results_black_deaths: {
		get: function () {},
		set: function (text) { $("#ag-sm-results-black-deaths").text(text); }
	}

};

exports.single_match = new LogicalGroup(events, textElems);

exports.single_match.showResults = function (results) {
	console.log(results);
	this.text("results_red_food", "" + results.red.food);
	this.text("results_black_food", "" + results.black.food);
	this.text("results_red_deaths", "" + results.red.deaths);
	this.text("results_black_deaths", "" + results.black.deaths);
	$("#ag-sm-results").modal("show");
};

})();
