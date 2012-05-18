var CONTEST = (function () {
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
		return fixtures; // them's a lot of fixtures!
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

		contest.brains = newBrains;
		contest.worlds = newWorlds;
	}
})();