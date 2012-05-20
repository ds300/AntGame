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
		view.run_sans.text("world_name", world.name);

		view.run_sans.on("cancel", function () {
			tearDown();
			onCancel();
		}, true);

		view.menu.goto("run_sans");
		view.menu.hideBreadcrumbs();
		run(game, rounds, onFinish);
	};


	function run(game, rounds, onFinish) {
		var i = 0;
		function updateProgressBar() {
			view.run_sans.text(
				"progress",
				Math.floor(100 / rounds * i) + "%"
			);
		}
		function doSomeRounds() {
			var numToRun = Math.min(500, rounds - i);
			if (numToRun > 0) {
				game.run(numToRun);
				i += numToRun;
				updateProgressBar();
				window.postMessage('','*');
			} else {
				tearDown();
				onFinish(game.getScore());
			}
		}
		window.addEventListener('message', doSomeRounds, false);
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