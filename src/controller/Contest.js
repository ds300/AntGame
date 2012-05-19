var CONTEST = (function () {
	var go = function (brains, worlds) {

	};

	function getFixtures(brains, worlds) {
		var fixtures = [];
		var numBrains = brains.length;
		var numWorlds = worlds.length;
		for (var i = 0; i < numBrains; i++) {
			for (var j = i + 1; j < numBrains; j++) {
				for (var k = 0; k < numWorlds; k++) {
					fixtures.push({
						red: i,
						black: j,
						world: k,
						outcome: -1
					});
					fixtures.push({
						red: j,
						black: i,
						world: k,
						outcome: -1
					});
				}
			}
		}
		// them's a lot of fixtures!
		// let's mix them up a bit before we return them
		fixtures.sort(function () { return Math.random() - 0.5; });
		return fixtures; 
	}

	var contest = {};

	function setup(brains, worlds) {
		// we've just got a list of ids. Let's copy the objects 
		// over so if they get deleted elsewhere, we still have them.
		var newBrains = [];
		for (var i = brains.length - 1; i >= 0; i--) {
			var brain = BRAINS[brains[i]];
			newBrains.push({
				name: brain.name,
				source: brain.source,
				score: 0,
				fixtures: 0
			});
		};

		var newWorlds = [];
		for (var i = worlds.length - 1; i >= 0; i--) {
			var world = WORLDS[worlds[i]];
			newWorlds.push({
				name: world.name,
				source: world.source,
				red_food: 0,
				black_food: 0
			});
		};

		contest = {};

		contest.brains = newBrains;
		contest.worlds = newWorlds;
		contest.fixtures = getFixtures(newBrains, newWorlds);
		contest.played_fixtures = [];
	}

	function getRankedBrains(brains) {
		// first duplicate the array so we don't lose ids
		var ranked = [];
		for (var i = brains.length - 1; i >= 0; i--) {
			ranked.push(brains[i]);
		};
		ranked.sort(function (a, b) {
			return b.score - a.score;
		});
		return ranked;
	}

	function printRankings() {
		view.contest.populateRankings(getRankedBrains(contest.brains));
	}

	function printFixtures() {
		var played = [];
		var remaining = [];
		for (var i = contest.fixtures.length - 1; i >= 0; i--) {
			var f = contest.fixtures[i];
			remaining.unshift({
				id: i,
				red_name: contest.brains[f.red].name,
				black_name: contest.brains[f.black].name,
				world_name: contest.worlds[f.world].name
			});
		}

		for (var i = contest.played_fixtures.length - 1; i >= 0; i--) {
			var f = contest.played_fixtures[i];
			played.push({
				outcome: f.outcome,
				red_name: contest.brains[f.red].name,
				black_name: contest.brains[f.black].name,
				world_name: contest.worlds[f.world].name
			});
		};

		
		view.contest.populateRemainingFixtures(remaining);
		view.contest.populatePlayedFixtures(played);
		if (remaining.length === 0) {
			view.contest.showPlayedFixtures();
		} else {
			view.contest.showRemainingFixtures();
		}
	}

	var go = function (brains, worlds) {
		if (brains && worlds) {
			setup(brains, worlds);
		}
		printRankings();
		printFixtures();
		view.menu.goto("contest");
	};

	function handleResults(results, fixtureId) {
		var f = contest.fixtures[fixtureId];
		if (results.red.food > results.black.food) {
			contest.brains[f.red].score += 2;
			f.outcome = 0;
		} else if (results.black.food > results.red.food) {
			contest.brains[f.black].score += 2;
			f.outcome = 2;
		} else {
			contest.brains[f.red].score += 1;
			contest.brains[f.black].score += 1;
			f.outcome = 1;
		}
		contest.brains[f.red].played += 1;
		contest.brains[f.black].played += 1;
		contest.worlds[f.world].red_food += results.red.food;
		contest.worlds[f.world].black_food += results.black.food;
		contest.fixtures.splice(fixtureId, 1);
		contest.played_fixtures.push(f);
	}

	function run_sans(id, onFinish) {
		var f = contest.fixtures[id];
		RUN_SANS.go(
			contest.brains[f.red],
			contest.brains[f.black],
			contest.worlds[f.world],
			30000,
			onFinish,
			go
		);
	}

	var init = function () {
		view.contest.on("play_all", function () {
			(function playAll(){
				if (contest.fixtures.length > 0) {
					run_sans(0, function (results) {
						handleResults(results, 0);
						playAll();
					});	
				} else {
					go();
				}
			})();
		});

		view.contest.on("play", function (id) {
			run_sans(id, function (results) {
				handleResults(results, id);
				go();
			});
		});

		view.contest.on("played_fixtures", function () {
			view.contest.showPlayedFixtures();
		});

		view.contest.on("remaining_fixtures", function () {
			view.contest.showRemainingFixtures();
		});
	};

	return {
		go: go,
		init: init
	}
})();