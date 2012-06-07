/**
 * This controls the running of the game with graphics
 */
var RUN = (function () {

	var speed = 3;

	/**
	 * takes the user to the graphics
	 * @param red The red brain
	 * @param black The black brain
	 * @param world the world
	 * @param round The number of rounds
	 * @param onFinish The callback to execute when the game has finished
	 * @param onCancel The callback to execute when the game is cancelled
	 */
	var go = function (red, black, world, rounds, onFinish, onCancel) {
		// precompile sprites
		view.game.setup(model.parseAntWorld(world.source));
		// take the user to the screen
		view.menu.goto("run");

		//********* setup match *********//
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

		// hook up callbacks
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

		// hide menu and go
		view.menu.hideBreadcrumbs();
		run(game, rounds, onFinish);

		view.game.text("speed", speed + "");
		view.game.text("red_name", red.name);
		view.game.text("black_name", black.name);


	};

	/**
	 * private function
	 * runs a game
	 * @param game The game to run
	 * @param rounds The number of rounds the game is to be run
	 * @param onFinish the callback to execute when the game finishes
	 */
	function run(game, rounds, onFinish) {
		var i = 0; // how many rounds we've already completed

		function updateScreen() {
			view.game.newFrame();
			game.withAnts(view.game.drawAnt);
		}

		var timeout; // we need to use a setTimeout to get things slow

		// this function does some rounds according to speed and how many
		// rounds remain
		function doSomeRounds() {
			// decide how many rounds to do
			var numToRun = Math.min(Math.max(11 * speed-1, 1), rounds - i);
			if (numToRun > 0) {
				// do the rounds
				game.run(numToRun);
				i += numToRun;
				updateScreen();
				if (speed < 6) {
					// make it a bit slow
					timeout = setTimeout(doSomeRounds, 30);
				} else {
					// super fastness
					window.postMessage('','*');
				}
			} else {
				tearDown();
				onFinish(game.getScore());
			}
		}
		/* For those who are not familiar with javascript:
			There are no threads in javascript, so if you want to do something
			which is gonna take a while without locking up the UI, you have to
			split that thing into chunks, making calls to some browser function
			that allows the UI to be updated in between those chunks. There are
			three primary ways of doing this that I am aware of:
				- Using setTimeout or setInterval
				- using window.postMessage
				- using requestAnimationFrame
			With the set* functions and requestAF function, there is normally a
			significant time delay (around 10ms but it varies from browser to
			browser) involved which means that you're wasting CPU cycles. The
			postMessage function has almost no delay in modern browsers, though
			it is not intended to be used in this way. I have used it here, and
			it is good. I have also used setTimeout when the need to slow things
			down a bit arises.
		*/

		// this is for the postMessage function
		window.addEventListener('message', doSomeRounds, false);

		// remove looping mechanisms
		removeEventListener = function () {
			clearTimeout(timeout);
			window.removeEventListener('message', doSomeRounds, false);
		};

		// begin execution
		doSomeRounds();
	}

	var removeEventListener = function () {};

	// stop things from happening, and show the nav stuff again.
	function tearDown() {
		removeEventListener();
		view.menu.showBreadcrumbs();
	}

	return {
		go: go
	};
})();
