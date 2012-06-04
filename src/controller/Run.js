var RUN = (function () {

	var speed = 3;

	var go = function (red, black, world, rounds, onFinish, onCancel) {
		view.game.setup(model.parseAntWorld(world.source));
		view.menu.goto("run");

		var rng = model.RandomNumberGenerator();
		var redBrain = model.AntBrain(
			model.parseAntBrain(red.source), 
			"red",
			rng,
			view.game.drawFood,
			view.game.mark,
			view.game.unmark
		);
		var blackBrain = model.AntBrain(
			model.parseAntBrain(black.source),
			"black",
			rng,
			view.game.drawFood,
			view.game.mark,
			view.game.unmark
		);
		var antworld = model.AntWorld(model.parseAntWorld(world.source));
		var game = model.AntGame(redBrain, blackBrain, antworld);

		view.game.on("speed_up", function () {
			speed = Math.min(speed + 1, 10);
			view.game.text("speed", speed + "");
		}, true);

		view.game.on("speed_down", function () {
			speed = Math.max(speed - 1, 1);
			view.game.text("speed", speed + "");
		}, true);

		view.game.on("cancel", function () {
			tearDown();
			onCancel();
		}, true);

		view.menu.hideBreadcrumbs();
		run(game, rounds, onFinish);

		view.game.text("speed", speed + "");
		view.game.text("red_name", red.name);
		view.game.text("black_name", black.name);


	};

	function run(game, rounds, onFinish) {
		var i = 0;
		function updateProgressBar() {
			view.game.newFrame();
			game.withAnts(view.game.drawAnt);
		}
		var timeout;
		function doSomeRounds() {
			var numToRun = Math.min(Math.max(11 * speed-1, 1), rounds - i);
			if (numToRun > 0) {
				game.run(numToRun);
				i += numToRun;
				updateProgressBar();
				if (speed < 6) {
					timeout = setTimeout(doSomeRounds, 30);
				} else {
					window.postMessage('','*');
				}
			} else {
				tearDown();
				onFinish(game.getScore());
			}
		}
		window.addEventListener('message', doSomeRounds, false);
		removeEventListener = function () {
			clearTimeout(timeout);
			window.removeEventListener('message', doSomeRounds, false);
		};
		doSomeRounds();
	}

	var removeEventListener = function () {};

	function tearDown() {
		removeEventListener();
		view.menu.showBreadcrumbs();
	}

	return {
		go: go
	};
})();