/**
 * this provides an access layer to the dynamic elements which comprise the
 * contest fixtures/stats screen.
 */
(function () {

var events = [
	{
		// the button which takes the user from the setup screen to the
		// fixtures/stats screen
		name: "go",
		binder: function (callback) {
			$("#ag-c-go").click(callback);
		}
	},
	{
		// the button on the fixtures/stats screen which lets the user play all
		// of the remaining matches sequentially
		name: "play_all",
		binder: function (callback) {
			$("#ag-c-play-all").click(callback);
		}
	},
	{
		// the button on a particular fixture which allows the user to play that
		// particular fixture independently
		name: "play",
		binder: function () {} // bound dynamically
	},
	{
		// triggered when the user toggles the graphics to be off
		name: "vis_off",
		binder: function (callback) {
			$(".ag-vis-on").click(function () {
				callback("off");
			});
		}
	},
	{
		// triggered when the user toggles the graphics to be on
		name: "vis_on",
		binder: function (callback) {
			$(".ag-vis-off").click(function () {
				callback("on");
			});
		}
	},
	{
		// the tab which shows the list of played fixtures
		name: "played_fixtures",
		binder: function (callback) {
			$("#ag-c-fix-played-link").click(callback);
		}
	},
	{
		// the tab which shows the list of remaining fixtures
		name: "remaining_fixtures",
		binder: function (callback) {
			$("#ag-c-fix-rem-link").click(callback);
		}
	}
];

var textElems = {
	// the number of fixtures played
	// shown in the related tab
	fixtures_played: {
		get: function () { $("#ag-c-fix-played-text").text(); },
		set: function (text) { $("#ag-c-fix-played-text").text(text); }
	},
	// the number of fixtures remaining
	// shown in the related tab
	fixtures_remaining: {
		get: function () { $("#ag-c-fix-rem-text").text(); },
		set: function (text) { $("#ag-c-fix-rem-text").text(text); }
	}

};

exports.contest = new LogicalGroup(events, textElems);

/**
 * Shows the table of remaining fixtures
 */
exports.contest.showRemainingFixtures = function () {
	showHideFixtures("rem", "played");
	$("#ag-c-play-all").show();
};

/**
 * shows the table of played fixtures
 */
exports.contest.showPlayedFixtures = function () {
	showHideFixtures("played", "rem");
	$("#ag-c-play-all").hide();
};

/**
 * private function
 * toggles between played/remaining fixtures tables
 * @param toShow The type of fixtures to show
 * @param toHide The type of fixtures to hide
 */
function showHideFixtures(toShow, toHide) {
	$("#ag-c-fix-" + toHide + "-link").parent().removeClass("active");
	$("#ag-c-fix-" + toHide).hide();
	$("#ag-c-fix-" + toShow + "-link").parent().addClass("active");
	$("#ag-c-fix-" + toShow).show();
}

/**
 * populates the rankings table with brains and stats
 * @param rankedBrains A sorted list of brains along with stats metadata.
 */
exports.contest.populateRankings = function (rankedBrains) {
	// get table element
	var t = $("#ag-c-rankings");

	// clear it, and create the headings
	t.html("");
	var headings = "";
	headings += "<thead>";
	headings +=   "<tr>";
	headings +=     "<th>Rank</th>";
	headings +=     "<th>Brain</th>";
	headings +=     "<th>Played</th>";
	headings +=     "<th>Score</th>";
	headings +=   "</tr>";
	headings += "</thead>";
	t.append(headings);

	var rank = 1;
	var numBrains = rankedBrains.length;
	// iterate over brains
	for (var i = 0; i < numBrains; i++) {
		// construct table row html and insert into document
		var row = "";
		row += "<tr>";
		row += "<td>" + rank + "</td>";
		row += "<td>" + rankedBrains[i].name + "</td>";
		row += "<td>" + rankedBrains[i].fixtures + "</td>";
		row += "<td>" + rankedBrains[i].score + "</td>";
		row += "</tr>";
		t.append(row);
		if (i < numBrains - 1 && 
			rankedBrains[i].score !== rankedBrains[i + 1].score) {
			rank++;
		}
	}
};

/**
 * Populates the table of remaining fixtures
 * @param fixtures A list of fixtures that haven't been played yet
 */
exports.contest.populateRemainingFixtures = function (fixtures) {
	var numFixtures = fixtures.length;
	this.text("fixtures_remaining", numFixtures + "");

	// get table element
	var t = $("#ag-c-fix-rem");

	// clear it and insert table headings
	t.html("");
	var headings = "";
	headings += "<thead>";
	headings +=   "<tr>";
	headings +=     "<th>Red Brain</th>";
	headings +=     "<th>Black Brain</th>";
	headings +=     "<th>World</th>";
	headings +=   "</tr>";
	headings += "</thead>";
	t.append(headings);

	// it is possible for this list to be empty, so check if that is the case
	// and output an appropriate row saying so
	if (numFixtures === 0) {
		t.append("<tr><td colspan='3'>" +
		           "<span style='font-style: italic'>none</span>" +
		         "</td></tr>");
		return;
	}

	// iterate over fixtures
	for (var i = 0; i < numFixtures; i++) {
		// create row
		var row = $("<tr></tr>").appendTo(t);
		// create cells
		$("<td>" + fixtures[i].red_name + "</td>").appendTo(row);
		$("<td>" + fixtures[i].black_name + "</td>").appendTo(row);
		$("<td>" + fixtures[i].world_name + "</td>").appendTo(row);

		// create an empty cell in which to put the play button
		var finalCell = $("<td style='border-left: none;'></td>").appendTo(row);
		var play_btn = $('<a class="btn btn-mini btn-primary pull-right"' + 
		                 'style="position:absolute; margin-left: -35px;">' +
		                 'play &raquo;</a>').appendTo(finalCell).hide();

		// hook up play button with event listener and make it appear only on 
		// mouse hover
		with ({id: fixtures[i].id, that: this, pb: play_btn}) {
			play_btn.click(function () {
				that.trigger("play", [id]);
			});
			row.hover(function () { pb.show(); }, function () { pb.hide(); });
		}

	}
};

// the colors that brain names are given depending on how they performed in a
// particular fixture
var colors = {
	win: "#A22",
	lose: "#000",
	draw: "#22A"
};

// this is just to make it easier to check what color a brain should be
// given the 'outcome' property of a fixture (which is 0 for red win, 1 for 
// draw, 2 for black win)
var team_colors = {
	red: {
		"0": colors["win"],
		"1": colors["draw"],
		"2": colors["lose"]
	},
	black: {
		"2": colors["win"],
		"1": colors["draw"],
		"0": colors["lose"]
	}
};

/**
 * private function
 * gets some html which colors a string of text
 * @param color The color of the ant brain during the fixture
 * @param name The name of the ant brain
 * @param outcome The outcome of the fixture
 * @returns name wrapped in <span> tags with appropriate color style
 */
function getColoredName(color, name, outcome) {
	color = team_colors[color][outcome];
	return '<span style="color: ' + color + '">' + name + '</span>';
}

/**
 * Populates the table of played fixtures
 * @param fixtures The fixtures which have been played
 */
exports.contest.populatePlayedFixtures = function (fixtures) {
	var numFixtures = fixtures.length;
	this.text("fixtures_played", numFixtures + "");

	// get table element
	var t = $("#ag-c-fix-played");

	// clear it and insert table headings
	t.html("");
	var headings = "";
	headings += "<thead>";
	headings +=   "<tr>";
	headings +=     "<th>Red Brain</th>";
	headings +=     "<th>Black Brain</th>";
	headings +=     "<th>World</th>";
	headings +=   "</tr>";
	headings += "</thead>";
	t.append(headings);

	// it is possible for this list to be empty, so check if that is the case
	// and output an appropriate row saying so
	if (numFixtures === 0) {
		t.append("<tr><td colspan='3'>" +
		           "<span style='font-style: italic'>none</span>" +
		         "</td></tr>");
		return;
	}

	// iterate over fixtures to build table row htmls
	for (var i = 0; i < numFixtures; i++) {
		var f = fixtures[i];
		var row = $("<tr></tr>").appendTo(t);
		var red_name = getColoredName("red", f.red_name, f.outcome);
		var black_name = getColoredName("black", f.black_name, f.outcome);
		$("<td>" + red_name + "</td>").appendTo(row);
		$("<td>" + black_name + "</td>").appendTo(row);
		$("<td>" + f.world_name + "</td>").appendTo(row);
	}
};

})();
