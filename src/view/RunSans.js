/**
 * This provides an access layer to the screen which is shown when a game
 * is running without (hence 'sans') graphics.
 */

(function () {

var events = [
	{
		// the button to cancel game execution
		name: "cancel",
		binder: function (callback) {
			$("#ag-run-sans-cancel").click(callback);
		}
	}
];

var textElems = {
	// the name of the red team
	red_name: {
		get: function () { return $("#ag-run-sans-red").text(); },
		set: function (text) { $("#ag-run-sans-red").text(text); }
	},
	// the name of the black team
	black_name: {
		get: function () { return $("#ag-run-sans-black").text(); },
		set: function (text) { $("#ag-run-sans-black").text(text); }
	},
	// the name of the world
	world_name: {
		get: function () { return $("#ag-run-sans-world").text(); },
		set: function (text) { $("#ag-run-sans-world").text(text); }
	},
	// the width of the progress bar
	progress: {
		get: function () {},
		set: function (percent) {
			$("#ag-run-sans-progress").attr("style", "width: " + percent);
		}
	}
};

exports.run_sans = new LogicalGroup(events, textElems);

})();