/**
 * This provides an access layer to the dynamic elements which compris the
 * contest setup screen. namely the lists of worlds and brains.
 */

(function () {

/**
 * private function
 * gets a logical group and related methods for a contest list. the idea is
 * that the brain list and world list are pretty much the same thing so
 * abstract it into this one chunk of code.
 */
function getContestList (baseElem) {
	var list = new LogicalGroup([
		{
			// The button to add a brain/world to the contest list
			name: "add",
			binder: function (callback) {
				$("#ag-c-add-" + baseElem).click(callback);
			}
		},
		{
			// the button to dismiss a particular brain/world from the contest
			// lists (bound dynamically)
			name: "dismiss",
			binder: function () {}
		},
	], {});

	/**
	 * adds an item to the list
	 * @param name The name of the item
	 * @param id The unique id number of the item
	 */
	list.add = function (name, id) {
		// compile individual html elements
		var list_item = item_name = dismiss_btn = "";

		list_item   += "<tr class='ag-c-" + baseElem + 
		                                "-item' id='" + id + "'>";
		
		item_name   +=   "<td>";
		item_name   +=      name;
		
		dismiss_btn +=      "<a class='btn btn-mini btn-warning " + 
		                          "pull-right rightmost' href='#'>";
		dismiss_btn +=        "dismiss &raquo;";
		dismiss_btn +=      "</a>";

		item_name   +=   "</td>";

		list_item   += "</tr>";

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

	/**
	 * clears the list
	 */
	list.clear = function () {
		$("#ag-c-" + baseElem + "-list").html("");
	};

	/**
	 * Removes an item from the list
	 * @param id The id of the item to remove
	 */
	list.remove = function (id) {
		$(".ag-c-" + baseElem + "-item[id='" + id + "']").remove();
	};

	/**
	 * empties the list and causes a "none selected" message to be displayed
	 */
	list.sayEmpty = function () {
		$("#ag-c-" + baseElem + "-list").html('<tr><td><span style="font-style: italic">none selected</span></td></tr>');
	};

	return list;
}

exports.contest.worlds = getContestList("worlds");
exports.contest.brains = getContestList("brains");


})();
