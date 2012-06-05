var LogicalGroup = LogicalGroup || function () {};

/**
 * this provides an access layer to the dynamic elements which comprise the
 * list of available brains that the user may choose for matches or contests.
 */
(function () {

var events = [
	{
		// the button that allows a user to add a new brain
		name: "add",
		binder: function (callback) {
			$("#ag-bl-add").click(callback);
		}
	},
	// these next four events are bound dynamically
	{
		// the button on a particular brain which allows the user to edit the
		// source code and name
		name: "edit",
		binder: function () {}
	},
	{
		// the button on a particular brain which allows the user to pick it
		// for use in a match or contest
		name: "pick",
		binder: function () {}
	},
	{
		// triggered when the user clicks over the brain item in the list
		name: "select",
		binder: function () {}
	},
	{
		// the button on a particular brain which allows the user to delete it
		name: "delete",
		binder: function () {}
	}
];

var textElems = {
	// source is the <pre> box on the right hand side of the brain list screen.
	// it shows the source code of the highlighted brain
	source: {
		get: function () { return $("#ag-bl-selected-source").html(); },
		set: function (text) { $("#ag-bl-selected-source").html(text); }
	}
};

exports.brain_list = getItemList(events, textElems, "bl");


})();
