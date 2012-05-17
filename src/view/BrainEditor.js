var LogicalGroup = LogicalGroup || function () {};

(function () {

var events = [
	{
		name: "cancel",
		binder: function (callback) {
			$(".ag-brain-edit-close").click(callback);
		},
	},
	{
		name: "compile",
		binder: function (callback) {
			$("#ag-brain-edit-compile").click(callback);
		}
	},
	{
		name: "name_change",
		binder: function (callback) {
			$("#ag-brain-edit-name").change(function () {
				callback($("#ag-brain-edit-name").val());
			});
		}
	}
];

var textElems = {
	title: {
		get: function () { return $("#ag-brain-edit-title").html(); },
		set: function (text) { $("#ag-brain-edit-title").html(text); }
	},
	name: {
		get: function () { return $("#ag-brain-edit-name").attr("value"); },
		set: function (text) { $("#ag-brain-edit-name").attr("value", text); }
	},
	code: {
		get: function () { return $("#ag-brain-edit-code").attr("value"); },
		set: function (text) { $("#ag-brain-edit-code").attr("value", text); }
	}
};

exports.brain_edit = new LogicalGroup(events, textElems);

exports.brain_edit.show = function () {
	$("#ag-brain-edit").modal("show");
};

exports.brain_edit.hide = function () {
	$("#ag-brain-edit").modal("hide");
};

})();