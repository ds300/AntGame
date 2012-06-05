/**
 * LogicalGroup
 * This is the fundamental javascript component of the view module. It gives
 * a neat abstraction for dealing with events and updating text on the screen
 * for some logically-grouped set of DOM elements or other things.
 * @param events The events which this group deals with
 * @param textElems The text elements which this group deals with.
 * @returns the logical group
 */
function LogicalGroup(events, textElems) {
	this.events = events;
	this.callbacks = {};
	this.textElems = textElems;

	// set callback lists based on event names
	for (var i = events.length - 1; i >= 0; i--) {
		this.callbacks[events[i].name] = [];
	}

	/**
	 * This binds a callback to a particular event
	 * @param evnt The event to bind
	 * @param callback The callback to call when the event is triggered
	 * @param overwrite (optional) if set to a truthy value, deletes any 
	 *        callbacks previously registered with this event before adding
	 *        the new one.
	 */
	this.on = function (evnt, callback, overwrite) {
		if (Array.isArray(this.callbacks[evnt]) && typeof callback === "function") {
			if (overwrite) {
				this.callbacks[evnt] = [];
			}
			this.callbacks[evnt].push(callback);
		}
	};

	/**
	 * Gets or sets the desired text element
	 * @param elem The name of the text element
	 * @param text (optional) if set and a string, sets the text of the given
	 *        text element to the value passed.
	 * @returns undefined if text given, the current text of the element
	 *          otherwise.
	 */
	this.text = function (elem, text) {
		if (this.textElems[elem]) {
			if (typeof text === 'string') {
				this.textElems[elem].set(text);
			} else {
				return this.textElems[elem].get();
			}
		}
	};

	/**
	 * triggers an event
	 * @param evnt The event to trigger
	 * @param argsArray (optional) A list of arguments to pass to any bound 
	 *        callbacks
	 */
	this.trigger = function (evnt, argsArray) {
		if (Array.isArray(this.callbacks[evnt])) {
			// iterate over callbacks and call them!

			for (var i = this.callbacks[evnt].length - 1; i >= 0; i--) {
				this.callbacks[evnt][i].apply(this, argsArray);
			};
		}
	};

	/**
	 * initialises the logical group. Specifically, it binds the callback
	 * interface to the specified DOM elements.
	 */
	this.init = function () {
		var that = this;
		for (var i = this.events.length - 1; i >= 0; i--) {
			var evnt = this.events[i].name;
			this.events[i].binder((function (evnt) {
				return function () {
					// iterate over callbacks and call them!
					for (var i = that.callbacks[evnt].length - 1; i >= 0; i--) {
						that.callbacks[evnt][i].apply(this, arguments);
					};
				};
			})(evnt));
		};
	};
}
