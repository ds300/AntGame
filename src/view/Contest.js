(function () {

var events = [
	{
		name: "go",
		binder: function (callback) {
			$("#ag-c-go").click(callback);
		}
	},
	{
		name: "play_all",
		binder: function (callback) {
			$("#ag-c-play-all").click(callback);
		}
	},
	{
		name: "play",
		binder: function () {} // bound dynamically
	},
	{
		name: "vis_off",
		binder: function (callback) {
			$(".ag-vis-on").click(function () {
				callback("off");
			});
		}
	},
	{
		name: "vis_on",
		binder: function (callback) {
			$(".ag-vis-off").click(function () {
				callback("on");
			});
		}
	},
	{
		name: "played_fixtures",
		binder: function (callback) {
			$("#ag-c-fix-played-link").click(callback);
		}
	},
	{
		name: "remaining_fixtures",
		binder: function (callback) {
			$("#ag-c-fix-rem-link").click(callback);
		}
	}
];

var textElems = {
	fixtures_played: {
		get: function () { $("#ag-c-fix-played-text").text(); },
		set: function (text) { $("#ag-c-fix-played-text").text(text); }
	},
	fixtures_remaining: {
		get: function () { $("#ag-c-fix-rem-text").text(); },
		set: function (text) { $("#ag-c-fix-rem-text").text(text); }
	}

};

exports.contest = new LogicalGroup(events, textElems);

exports.contest.showRemainingFixtures = function () {
	showHideFixtures("rem", "played");
	$("#ag-c-play-all").show();
};

exports.contest.showPlayedFixtures = function () {
	showHideFixtures("played", "rem");
	$("#ag-c-play-all").hide();
};

function showHideFixtures(toShow, toHide) {
	$("#ag-c-fix-" + toHide + "-link").parent().removeClass("active");
	$("#ag-c-fix-" + toHide).hide();
	$("#ag-c-fix-" + toShow + "-link").parent().addClass("active");
	$("#ag-c-fix-" + toShow).show();
}

exports.contest.populateRankings = function (rankedBrains) {
	var t = $("#ag-c-rankings");
	t.html("");
	t.append('<thead><tr><th>Rank</th><th>Brain</th><th>Played</th><th>Score</th></tr></thead>');

	var rank = 1;
	var numBrains = rankedBrains.length;
	for (var i = 0; i < numBrains; i++) {
		var row = "";
		row += "<tr>";
		row += "<td>" + rank + "</td>";
		row += "<td>" + rankedBrains[i].name + "</td>";
		row += "<td>" + rankedBrains[i].fixtures + "</td>";
		row += "<td>" + rankedBrains[i].score + "</td>";
		row += "</tr>";
		t.append(row);
		if (i < numBrains - 1 && rankedBrains[i].score !== rankedBrains[i + 1].score) {
			rank++;
		}
	}
};

exports.contest.populateRemainingFixtures = function (fixtures) {
	var numFixtures = fixtures.length;
	this.text("fixtures_remaining", numFixtures + "");
	var t = $("#ag-c-fix-rem");
	t.html("");
	t.append('<thead><tr><th>Red Brain</th><th>Black Brain</th><th>World</th></tr></thead>');
	if (numFixtures === 0) {
		t.append("<tr><td colspan='3'><span style='font-style: italic'>none</span></td></tr>")
		return;
	}

	for (var i = 0; i < numFixtures; i++) {
		var row = $("<tr></tr>").appendTo(t);
		$("<td>" + fixtures[i].red_name + "</td>").appendTo(row);
		$("<td>" + fixtures[i].black_name + "</td>").appendTo(row);
		$("<td>" + fixtures[i].world_name + "</td>").appendTo(row);
		var finalCell = $("<td style='border-left: none;'></td>").appendTo(row);
		var play_btn = $('<a class="btn btn-mini btn-primary pull-right"' + 
		                 'style="position:absolute; margin-left: -35px;">play &raquo;</a>').appendTo(finalCell).hide();

		with ({id: fixtures[i].id, that: this, pb: play_btn}) {
			play_btn.click(function () {
				that.trigger("play", [id]);
			});
			row.hover(function () { pb.show(); }, function () { pb.hide(); });
		}

	}
};

var colors = {
	win: "#A22",
	lose: "#000",
	draw: "#22A"
};

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

function getColoredName(color, name, outcome) {
	color = team_colors[color][outcome];
	return '<span style="color: ' + color + '">' + name + '</span>';
}

exports.contest.populatePlayedFixtures = function (fixtures) {
	var numFixtures = fixtures.length;
	this.text("fixtures_played", numFixtures + "");
	var t = $("#ag-c-fix-played");
	t.html("");
	t.append('<thead><tr><th>Red Brain</th><th>Black Brain</th><th>World</th></tr></thead>');
	if (numFixtures === 0) {
		t.append("<tr><td colspan='3'><span style='font-style: italic'>none</span></td></tr>")
		return;
	}

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