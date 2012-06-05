/**
 * This controls the running of matches without graphics
 */
var RUN_SANS = (function () {

	/**
	 * takes the user to the screen and begins the match
	 * @param red The red brain
	 * @param black The black brain
	 * @param world The world
	 * @param rounds The number of rounds
	 * @param onFinish The callback to execute when the match is done
	 * @param onCancel The callback to execute when the match is cancelled
	 */
	var go = function (red, black, world, rounds, onFinish, onCancel) {
		// setup the match
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

		// setup the text components
		view.run_sans.text("red_name", red.name);
		view.run_sans.text("black_name", black.name);
		view.run_sans.text("world_name", world.name);

		// when the user cancels the match
		view.run_sans.on("cancel", function () {
			tearDown();
			onCancel();
		}, true);

		// hide the menu, go to the screen, and start the match
		view.menu.goto("run_sans");
		view.menu.hideBreadcrumbs();
		run(game, rounds, onFinish);
	};

	/**
	 * private function
	 * runs a game
	 * @param game The game to run
	 * @param rounds The number of rounds for which to run the game
	 * @param onFinish The callback to execute when the game has finished
	 */
	function run(game, rounds, onFinish) {
		var i = 0; // the number of rounds already completed

		function updateProgressBar() {
			view.run_sans.text(
				"progress",
				Math.floor(100 / rounds * i) + "%"
			);
		}

		function doSomeRounds() {
			// run the game in chunks of 500 rounds
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

		// stop the loop propogation
		removeEventListener = function () {
			window.removeEventListener('message', doSomeRounds, false);
		};
		doSomeRounds();
	}

	var removeEventListener = function () {};

	function tearDown() {
		removeEventListener();
		view.menu.showBreadcrumbs();
		view.run_sans.text("progress", "0%");
	}

	return {
		go: go
	};
})();