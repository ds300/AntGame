var RUN_SANS = (function () {

	var go = function (red, black, world, rounds, onFinish, onCancel) {
		var rng = model.RandomNumberGenerator();
		var redBrain = model.AntBrain(
			model.parseAntBrain(red.source), 
			"red",
			rng
		);
		var blackBrain = model.AntBrain(
			model.parseAntBrain(black.source),
			"black",
			rng
		);
		var antworld = model.AntWorld(model.parseAntWorld(world.source));
		var game = model.AntGame(redBrain, blackBrain, antworld);

		view.run_sans.text("red_name", red.name);
		view.run_sans.text("black_name", black.name);

		view.run_sans.on("cancel", function () {
			clearTimeout(timeout);
			tearDown();
			onCancel();
		});
		view.menu.goto("sm_run_sans");
		view.menu.hideBreadcrumbs();
		run(game, rounds, onFinish);
	};

	var timeout;

	function run(game, rounds, onFinish) {
		var i = 0;
		function doSomeRounds() {
			var numToRun = Math.min(500, rounds - i);
			if (numToRun > 0) {
				game.run(numToRun);
				i += numToRun;
				view.run_sans.text(
					"progress",
					Math.floor(100 / rounds * i) + "%"
				);
				timeout = setTimeout(doSomeRounds, 0);
			} else {
				// gather stats
				tearDown();
				onFinish();
			}
		}
		doSomeRounds();
	}

	function tearDown() {
		view.menu.showBreadcrumbs();
		view.run_sans.text("progress", "0%");
	}

	return {
		go: go
	};
})();