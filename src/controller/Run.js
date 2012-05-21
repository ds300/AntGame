var RUN = (function () {

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


		view.menu.hideBreadcrumbs();
		run(game, rounds, onFinish);

	};

	function run(game, rounds, onFinish) {
		var i = 0;
		function updateProgressBar() {
			view.game.newFrame();
			game.withAnts(view.game.drawAnt);
		}
		function doSomeRounds() {
			var numToRun = Math.min(50, rounds - i);
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
		removeEventListener = function () {
			window.removeEventListener('message', doSomeRounds, false);
		};
		doSomeRounds();
	}

	var removeEventListener = function () {};


	return {
		go: go
	};
})();