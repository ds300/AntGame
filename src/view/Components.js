var callbacks = {
	goto_main_menu: function () {},
	goto_single_match: function () {},
	goto_contest: function () {},
	sm_pick_red_brain: function () {},
	sm_pick_black_brain: function () {},
	brain_list_add: function () {},
	brain_list_edit: function () {},
	brain_list_delete: function () {},
	brain_list_pick: function () {},
	brain_list_select: function () {}
};

exports.brain_list = (function () {
	var highlighted = 0;
	var add = function (name, id, preset) {
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

		var li = $(list_item).appendTo("#ag-bl-list");
		var a = $(brain_name).appendTo(li);

		var btns = $(btn_group).appendTo(a).hide();

		if (!preset) {
			var del = $(del_btn).appendTo(btns);
			del.click(function (event) { 
				event.stopPropagation();
				callbacks["brain_list_delete"](id, highlighted); 
			});

			var edit = $(edit_btn).appendTo(btns);
			edit.click(function () { callbacks["brain_list_edit"](id); });
		}

		var pick = $(pick_btn).appendTo(btns);
		pick.click(function (event) { 
			event.stopPropagation();
			callbacks["brain_list_pick"](id); 
		});

		li.hover(
			function (event) {
				btns.show();
			},
			function (obj) {
				btns.hide();
			}
		);

		li.click(function () { callbacks["brain_list_select"](id); });
	};

	var remove = function (id) {
		$(".ag-li-brain[id='" + id + "']").remove();
	};

	var highlight = function (id) {
		$(".ag-li-brain[id='" + highlighted + "']").removeClass("active");
		$(".ag-li-brain[id='" + id + "']").addClass("active");
		highlighted = id;
	};

	var clear = function () {
		$("#ag-bl-list").html("");
	};

	return {add:add,remove:remove, highlight:highlight, clear: clear};
})();


var locations = {
	root: {
		prerequisites: [],
		description: "Main Menu",
		selector: ".ag-root"
	},
	single_match: {
		prerequisites: ["root"],
		description: "Single Match",
		selector: ".ag-sm"
	},
	sm_pick_brain: {
		prerequisites: ["root","single_match"],
		description: "Pick Brain",
		selector: ".ag-bl"
	}
}

exports.goto = function (location) {
	// if the location exists
	if (locations[location]) {
		// hide all others
		for (var loc in locations) {
			if (locations.hasOwnProperty(loc)) {
				var s = locations[loc].selector;
				$(s + ", " + s + "-bc").hide();	
			}
		}
	}
	$(locations[location].selector).show();
	// construct breadcrumb trail
	var preq = locations[location].prerequisites;
	for (var i = 0, len = preq.length; i < len; i++) {
		var s = locations[preq[i]].selector;
		$(s + "-bc").show();
	}
}

exports.init = function () {
	// main menu elements
	$("#loading-bg").hide();

	var visToggle = $(".ag-vis-toggle");

	visToggle.html("with");

	visToggle.click(function () {
		var withVis = visToggle.html() === "with";
		visToggle.removeClass(!withVis ? "btn-danger" : "btn-warning");
		visToggle.addClass(!withVis ? "btn-warning" : "btn-danger");
		visToggle.html(withVis ? "without" : "with");
	});

	// static event emitting elements
	$(".ag-btn-root").click(function () { callbacks["goto_main_menu"](); });
	$(".ag-btn-sm").click(function () { callbacks["goto_single_match"](); });
	$(".ag-btn-contest").click(function () { callbacks["goto_contest"](); });
	$("#ag-sm-pick-red").click(function () { callbacks["sm_pick_red_brain"](); });
	$("#ag-sm-pick-black").click(function () { callbacks["sm_pick_black_brain"](); });
	$("#ag-bl-add").click(function () { callbacks["brain_list_add"](); });
};

// sets a function to be called when an event occurrs
exports.on = function (evnt, callback) {
	callbacks[evnt] = callback || callbacks[evnt] || function () {};
};

// manually triggers an event
exports.trigger = function (evnt) {
	callbacks[evnt] && callbacks[evnt]();
};

var textElems = {
	sm_brain_red: function (text) { $("#ag-sm-red-name").html(text); }, 
	sm_brain_black: function (text) { $("#ag-sm-black-name").html(text); },
	brain_list_source: function (text) { 
		$("#ag-bl-selected-source").html(text); 
	}
};

exports.text = function (elem, text) {
	if (textElems[elem]) {
		textElems[elem](text);
	}
};