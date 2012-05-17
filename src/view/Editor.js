var LogicalGroup = LogicalGroup || function () {};

(function () {

var events = [
	{
		name: "cancel",
		binder: function (callback) {
			$(".ag-edit-close").click(callback);
		},
	},
	{
		name: "compile",
		binder: function (callback) {
			$("#ag-edit-compile").click(callback);
		}
	},
	{
		name: "name_change",
		binder: function (callback) {
			$("#ag-edit-name").change(function () {
				callback($("#ag-edit-name").val());
			});
		}
	}
];

var textElems = {
	title: {
		get: function () { return $("#ag-edit-title").html(); },
		set: function (text) { $("#ag-edit-title").html(text); }
	},
	name: {
		get: function () { return $("#ag-edit-name").attr("value"); },
		set: function (text) { $("#ag-edit-name").attr("value", text); }
	},
	code: {
		get: function () { return $("#ag-edit-code").attr("value"); },
		set: function (text) { $("#ag-edit-code").attr("value", text); }
	}
};

exports.edit = new LogicalGroup(events, textElems);

exports.edit.show = function () {
	$("#ag-edit").modal("show");
};

exports.edit.hide = function () {
	$("#ag-edit").modal("hide");
};

})();