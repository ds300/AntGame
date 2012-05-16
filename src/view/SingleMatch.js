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
			$("#ag-sm-go").click(callback);
		}
	},
	{
		name: "vis_off",
		binder: function (callback) {
			$("#ag-sm-vis-on").click(function () {
				$("#ag-sm-vis-on").hide();
				$("#ag-sm-vis-off").show();
				callback("off");
			});
		}
	},
	{
		name: "vis_on",
		binder: function (callback) {
			$("#ag-sm-vis-off").click(function () {
				$("#ag-sm-vis-off").hide();
				$("#ag-sm-vis-on").show();
				callback("on");
			});
		}
	}
];

var textElems = {
	red_name: {
		get: function () {$("#ag-sm-red-name").html(); },
		set: function (text) { $("#ag-sm-red-name").html(text); }
	},
	black_name: {
		get: function () { $("#ag-sm-black-name").html(); },
		set: function (text) { $("#ag-sm-black-name").html(text); }
	},
	world_name: {
		get: function () { $("#ag-sm-world-name").html(); },
		set: function (text) { $("#ag-sm-world-name").html(text); }
	},
	rounds: {
		get: function () { $("#ag-sm-rounds").attr("value"); },
		set: function (text) { $("#ag-sm-rounds").attr("value", text); }
	}
};

exports.single_match = new LogicalGroup(events, textElems);

})();
