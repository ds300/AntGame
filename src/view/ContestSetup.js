(function () {

function getContestList (baseElem) {
	var list = new LogicalGroup([
		{
			name: "add",
			binder: function (callback) {
				$("#ag-c-add-" + baseElem).click(callback);
			}
		},
		{
			name: "dismiss",
			binder: function () {}
		},
	], {});
	list.add = function (name, id) {
		// compile individual html elements
		var list_item = item_name = dismiss_btn = "";
		list_item  += "<tr class='ag-c-" + baseElem + "-item' id='" + id + "'>";
		
		item_name += "<td>";
		item_name +=   name;
		
		dismiss_btn += "<a class='btn btn-mini btn-warning pull-right rightmost' href='#'>";
		dismiss_btn +=   "dismiss &raquo;";
		dismiss_btn += "</a>";

		item_name +=   "</td>";

		list_item  += "</tr>";

		// attach the html elements to the DOM and set up events & callbacks

		var tr = $(list_item).prependTo("#ag-c-" + baseElem + "-list");
		var td = $(item_name).appendTo(tr);

		var dismiss = $(dismiss_btn).appendTo(td).hide();

		var that = this;

		dismiss.click(function (event) { 
			event.stopPropagation();
			that.trigger("dismiss", [id]); 
		});

		tr.hover(
			function (event) {
				dismiss.show();
			},
			function (obj) {
				dismiss.hide();
			}
		);
	};

	list.clear = function () {
		$("#ag-c-" + baseElem + "-list").html("");
	};

	list.remove = function (id) {
		$(".ag-c-" + baseElem + "-item[id='" + id + "']").remove();
	};

	list.sayEmpty = function (id) {
		$("#ag-c-" + baseElem + "-list").html('<tr><td><span style="font-style: italic">none selected</span></td></tr>');
	};

	return list;
}

exports.contest.worlds = getContestList("worlds");
exports.contest.brains = getContestList("brains");


})();
