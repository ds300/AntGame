/**
 * This handles the coordination and running of contests
 */
var CONTEST = (function () {
	var vis = true; // whether or not graphics are to be used

	/**
	 * private function
	 * creates a list of fixtures given some brains and worlds
	 * @param brains The brains
	 * @param worlds The worlds
	 * @returns a list of fixtures
	 */
	function getFixtures(brains, worlds) {
		var fixtures = [];
		var numBrains = brains.length;
		var numWorlds = worlds.length;
		// iterate over all possible combinations of brains and worlds
		for (var i = 0; i < numBrains; i++) {
			for (var j = i + 1; j < numBrains; j++) {
				for (var k = 0; k < numWorlds; k++) {
					// play the brains against each other as each color
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

	/**
	 * private function
	 * setus up the contest given some brains and some world(s)
	 * @param brains The brains
	 * @param world The worlds
	 */
	function setup(brains, worlds) {
		// we've just got a list of ids. Let's copy the objects 
		// over so if they get deleted elsewhere, we still have them.
		// (they shouldn't get deleted elsewhere, but better safe than sorry)
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

	/**
	 * private function
	 * sorts the brains according to rank
	 * @param brains The brains
	 * @returns the brains ranked
	 */
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

	/**
	 * private function
	 * hooks into the view to populate the rankings list
	 */
	function printRankings() {
		view.contest.populateRankings(getRankedBrains(contest.brains));
	}

	/**
	 * private function
	 * hooks into the view to populate the fixtures lists
	 */
	function printFixtures() {
		var played = [];
		var remaining = [];

		// construct the lists
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

	/**
	 * takes the user to the contest fixtures/stats screen
	 * @param brains (optional) The brains to be used in the contest
	 * @param worlds (optional) The worlds to be used in the contest
	 */
	var go = function (brains, worlds) {
		if (brains && worlds) {
			setup(brains, worlds);
		}
		printRankings();
		printFixtures();
		view.menu.goto("contest");
	};

	/**
	 * private function
	 * takes the results of a fixture and modifies contest stats
	 * @param results The results
	 * @param fixtureId The id# of the fixture
	 */
	function handleResults(results, fixtureId) {
		var f = contest.fixtures[fixtureId];

		if (results.red.food > results.black.food) {
			// red team won
			contest.brains[f.red].score += 2;
			f.outcome = 0;
		} else if (results.black.food > results.red.food) {
			// black team won
			contest.brains[f.black].score += 2;
			f.outcome = 2;
		} else {
			// draw
			contest.brains[f.red].score += 1;
			contest.brains[f.black].score += 1;
			f.outcome = 1;
		}
		contest.brains[f.red].played += 1;
		contest.brains[f.black].played += 1;
		contest.worlds[f.world].red_food += results.red.food;
		contest.worlds[f.world].black_food += results.black.food;
		// remove this fixture and push it to played_fixtures
		contest.fixtures.splice(fixtureId, 1);
		contest.played_fixtures.push(f);
	}

	/**
	 * private function
	 * runs a fixture without graphics
	 * @param id The fixture id
	 * @param onFinish Callback to execute when the match is over
	 */
	function run_sans(id, onFinish) {
		var f = contest.fixtures[id];
		RUN_SANS.go(
			contest.brains[f.red],
			contest.brains[f.black],
			contest.worlds[f.world],
			300000,
			onFinish,
			function () { go(); } 
		);
	}

	/**
	 * private function
	 * runs a fixture with graphics
	 * @param id The fixture id
	 * @param onFinish Callback to execute when the match is over
	 */
	function run(id, onFinish) {
		var f = contest.fixtures[id];
		RUN.go(
			contest.brains[f.red],
			contest.brains[f.black],
			contest.worlds[f.world],
			300000,
			onFinish,
			function () { go(); } 
		);
	}


	/**
	 * initialises the contest stats/fixtures screen
	 * i.e. hooks into the view
	 */
	var init = function () {
		// when the user wants to play all remaining fixtures
		view.contest.on("play_all", function () {
			(function playAll() {
				// run with or without graphics?
				var func = vis ? run : run_sans;
				
				// do it recursive style
				if (contest.fixtures.length > 0) {
					func(0, function (results) {
						handleResults(results, 0);
						playAll();
					});	
				} else {
					go();
				}
			})();
		});

		// when the user wants to play a specific fixture
		view.contest.on("play", function (id) {
			// run with or without graphics?
			var func = vis ? run : run_sans;
			func(id, function (results) {
				handleResults(results, id);
				go();
			});
		});

		view.contest.on("vis_off", function () {
			vis = false;
		});
		view.contest.on("vis_on", function () {
			vis = true;
		});

		// when the user wants to see the played fixtures
		view.contest.on("played_fixtures", function () {
			view.contest.showPlayedFixtures();
		});

		// when the user wants to see the remaining fixtures
		view.contest.on("remaining_fixtures", function () {
			view.contest.showRemainingFixtures();
		});
	};

	return {
		go: go,
		init: init
	}
})();