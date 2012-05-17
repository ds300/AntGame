var getItemList = getItemList || function () {};

(function () {

var events = [
	{
		name: "add",
		binder: function (callback) {
			$("#ag-wl-add").click(callback);
		}
	},
	// these next four events are bound dynamically
	{
		name: "edit",
		binder: function () {}
	},
	{
		name: "pick",
		binder: function () {}
	},
	{
		name: "select",
		binder: function () {}
	},
	{
		name: "delete",
		binder: function () {}
	}
];

exports.world_list = getItemList(events, {}, "wl");

})();



