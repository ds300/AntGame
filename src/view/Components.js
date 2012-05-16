var callbacks = {
	goto_main_menu: function () {},
	goto_single_match: function () {},
	goto_contest: function () {},
	sm_pick_red_brain: function () {},
	sm_pick_black_brain: function () {},
	brain_list_edit: function () {},
	brain_list_delete: function () {},
	brain_list_pick: function () {},
	brain_list_select: function () {}
};

exports.brain_list = (function () {
	var highlighted = 0;
	var add = function (name, id) {
		var list_item = brain_name = btn_group = edit_btn = del_btn = pick_btn = "";
		list_item  += "<li class='ag-li-brain' id='" + id + "'>";
		
		brain_name += "<a href='#'>";
		brain_name +=   name;
		
		btn_group  +=     "<div class='btn-group pull-right'>"

		del_btn    +=       "<a class='btn btn-mini btn-danger' href='#'>";
		del_btn    +=         "<i class='icon-remove-sign icon-white'></i>";
		del_btn    +=       "</a>";

		edit_btn   +=       "<a class='btn btn-mini btn-warning' href='#'>";
		edit_btn   +=         "<i class='icon-pencil icon-white'></i>";
		edit_btn   +=       "</a>";

		pick_btn   +=       "<a class='btn btn-mini btn-success' href='#'>";
		pick_btn   +=         "use &raquo;";
		pick_btn   +=       "</a>";

		btn_group  +=     "</div>"

		brain_name +=   "</a>";

		list_item  += "</li>";

		var li = $(list_item).prependTo("#sm-brain-list");
		var a = $(brain_name).appendTo(li);

		var btns = $(btn_group).appendTo(a);
		var del = $(del_btn).appendTo(btns);
		var edit = $(edit_btn).appendTo(btns);
		var pick = $(pick_btn).appendTo(btns);

		li.hover(
			function (event) {
				btns.show();
			},
			function (obj) {
				btns.hide();
			}
		);

		edit.click(function () { callbacks["brain_list_edit"](id); });
		del.click(function () { callbacks["brain_list_del"](id); });
		edit.click(function () { callbacks["brain_list_pick"](id); });
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

	return {add:add,remove:remove, highlight:highlight};
})();


var requesters = {
	brain_list: function () {}
};

exports.supply = function (request, func) {
	requesters[request] = func || requesters[request] || function () {};
};

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
		selector: ".ag-sm-pick-brain"
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
};

exports.on = function (evnt, callback) {
	callbacks[evnt] = callback || callbacks[evnt] || function () {};
};

exports.error = function (header, body, onClose) {
	$("#ag-error-header").html(header);
	$("#ag-error-body").html(body);
	errorModal.on("hide", onClose);
	errorModal.modal("show");
};