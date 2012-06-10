var LogicalGroup = LogicalGroup || function () {};
/**
 * this provides an access layer to the dynamic elements which comprise the
 * brain/world source/name editor dialog.
 */
(function () {

var events = [
	{
		// the button to dismiss the editor dialog without saving changes
		name: "cancel",
		binder: function (callback) {
			$(".ag-edit-close").click(callback);
		},
	},
	{
		// the button to try to compile whatever is in the editor
		name: "compile",
		binder: function (callback) {
			$("#ag-edit-compile").click(callback);
		}
	},
	{
		// triggered when the name input field changes
		name: "name_change",
		binder: function (callback) {
			$("#ag-edit-name").change(function () {
				callback($("#ag-edit-name").val());
			});
		}
	},
	{
		// triggered when the user presses enter
		name: "enter_pressed",
		binder: function (callback) {
			$("#ag-edit-name").keypress(function (e) {
				if (e.which === 13) {
					e.preventDefault();
					callback();
				}
			});
		}
	}
];

var textElems = {
	// the title in the header of the dialog (e.g. "edit brain")
	title: {
		get: function () { return $("#ag-edit-title").html(); },
		set: function (text) { $("#ag-edit-title").html(text); }
	},
	// the name input field
	name: {
		get: function () { return $("#ag-edit-name").attr("value"); },
		set: function (text) { $("#ag-edit-name").attr("value", text); }
	},
	// the code textarea
	code: {
		get: function () { return $("#ag-edit-code").attr("value"); },
		set: function (text) { $("#ag-edit-code").attr("value", text); }
	}
};

exports.edit = new LogicalGroup(events, textElems);

/**
 * shows the editor dialog
 */
exports.edit.show = function () {
	$("#ag-edit").modal("show");
};

/**
 * hides the editor dialog
 */
exports.edit.hide = function () {
	$("#ag-edit").modal("hide");
};

})();
