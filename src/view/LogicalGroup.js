function LogicalGroup(events, textElems) {
	this.events = events;
	this.callbacks = {};
	this.textElems = textElems;

	for (var i = events.length - 1; i >= 0; i--) {
		this.callbacks[events[i].name] = function () {};
	};

	this.on = function (evnt, callback) {
		this.callbacks[evnt] = callback || this.callbacks[evnt] || function () {};
	};

	this.text = function (elem, text) {
		if (this.textElems[elem]) {
			if (typeof text === 'string') {
				this.textElems[elem].set(text);
			} else {
				return this.textElems[elem].get();
			}
		}
	};

	this.trigger = function (evnt) {
		this.callbacks[evnt] && this.callbacks[evnt]();
	};

	this.init = function () {
		var that = this;
		for (var i = this.events.length - 1; i >= 0; i--) {
			this.events[i].binder((function (i) {
				return function () {
					that.callbacks[that.events[i].name].apply(this, arguments);
				};
			})(i));
		};
	};
}
