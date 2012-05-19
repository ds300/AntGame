(function () {

var events = [
	{
		name: "cancel",
		binder: function (callback) {
			$("#ag-run-sans-cancel").click(callback);
		}
	}
];

var textElems = {
	red_name: {
		get: function () { return $("#ag-run-sans-red").text(); },
		set: function (text) { $("#ag-run-sans-red").text(text); }
	},
	black_name: {
		get: function () { return $("#ag-run-sans-black").text(); },
		set: function (text) { $("#ag-run-sans-black").text(text); }
	},
	world_name: {
		get: function () { return $("#ag-run-sans-world").text(); },
		set: function (text) { $("#ag-run-sans-world").text(text); }
	},
	progress: {
		get: function () {},
		set: function (percent) {
			$("#ag-run-sans-progress").css("width", percent);
		}
	}
};

exports.run_sans = new LogicalGroup(events, textElems);

})();