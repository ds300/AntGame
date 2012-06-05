var getItemList = getItemList || function () {};
/**
 * this provides an access layer to the dynamic elements which comprise the
 * list of available worlds that the user may choose for matches or contests.
 */
(function () {

var events = [
	{
		// the button to add a new world
		name: "add",
		binder: function (callback) {
			$("#ag-wl-add").click(callback);
		}
	},
	{
		// the button to generate a new pseudo-random world
		name: "generate",
		binder: function (callback) {
			$("#ag-wl-gen").click(callback);
		}
	},
	// these next four events are bound dynamically
	{
		// button to edit a world's source  code / name
		name: "edit",
		binder: function () {}
	},
	{
		// button to pick a world for use in contest/match
		name: "pick",
		binder: function () {}
	},
	{
		// triggered when the user clicks over the world in the list
		name: "select",
		binder: function () {}
	},
	{
		// button to delete a world from the list.
		name: "delete",
		binder: function () {}
	}
];

exports.world_list = getItemList(events, {}, "wl");

exports.world_list.thumb = function (canvas) {
	$("#ag-wl-thumb").html("");
	$("#ag-wl-thumb").append(canvas);
};

})();



