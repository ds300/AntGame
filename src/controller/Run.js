var RUN = (function () {

	var go = function (red, black, world, rounds, onFinish, onCancel) {
		view.game.setup(model.parseAntWorld(world.source));
		view.menu.goto("run");
	};


	return {
		go: go
	};
})();