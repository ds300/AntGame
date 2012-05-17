var LogicalGroup = LogicalGroup || function () {};

(function () {

var events = [
	{
		name: "add",
		binder: function (callback) {
			$("#ag-bl-add").click(callback);
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

var textElems = {
	source: {
		get: function () { return $("#ag-bl-selected-source").html(); },
		set: function (text) { $("#ag-bl-selected-source").html(text); }
	}
};

exports.brain_list = new LogicalGroup(events, textElems);

var highlighted = 0;

exports.brain_list.add = function (name, id, preset) {
	// compile individual html elements
	var list_item = brain_name = btn_group = edit_btn = del_btn = pick_btn = "";
	list_item  += "<li class='ag-li-brain' id='" + id + "'>";
	
	brain_name += "<a href='#'>";
	brain_name +=   name;
	
	btn_group  +=     "<div class='btn-group pull-right'>"
	
	if (!preset) { // only include delet  & edit button for custom brains
		del_btn +=      "<a class='btn btn-mini btn-danger' href='#'>";
		del_btn +=        "<i class='icon-remove-sign icon-white'></i>";
		del_btn +=      "</a>";

		edit_btn +=     "<a class='btn btn-mini btn-warning' href='#'>";
		edit_btn +=       "<i class='icon-pencil icon-white'></i>";
		edit_btn +=     "</a>";
	}
	

	pick_btn   +=       "<a class='btn btn-mini btn-success' href='#'>";
	pick_btn   +=         "use &raquo;";
	pick_btn   +=       "</a>";

	btn_group  +=     "</div>"

	brain_name +=   "</a>";

	list_item  += "</li>";

	// attach the html elements to the DOM and set up events & callbacks

	var li = $(list_item).appendTo("#ag-bl-list");
	var a = $(brain_name).appendTo(li);

	var btns = $(btn_group).appendTo(a).hide();

	var that = this;

	if (!preset) {
		var del = $(del_btn).appendTo(btns);
		del.click(function (event) { 
			event.stopPropagation();
			that.callbacks["delete"](id, highlighted); 
		});

		var edit = $(edit_btn).appendTo(btns);
		edit.click(function () { that.callbacks["edit"](id); });
	}

	var pick = $(pick_btn).appendTo(btns);
	pick.click(function (event) { 
		event.stopPropagation();
		that.callbacks["pick"](id); 
	});

	li.hover(
		function (event) {
			btns.show();
		},
		function (obj) {
			btns.hide();
		}
	);

	
	li.click(function () { that.callbacks["select"](id); });
};

exports.brain_list.highlight = function (id) {
	$(".ag-li-brain[id='" + highlighted + "']").removeClass("active");
	$(".ag-li-brain[id='" + id + "']").addClass("active");
	highlighted = id;
};

exports.brain_list.clear = function () {
	$("#ag-bl-list").html("");
};

exports.brain_list.remove = function (id) {
	$(".ag-li-brain[id='" + id + "']").remove();
};

})();
