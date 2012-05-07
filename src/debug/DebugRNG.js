/*
objects returned by this function interface with the pseudo-random 
number generator implemented in DebugRNG.java. This is for debugging purposes 
only and will not be included in the final build.
*/
var RandomNumberGenerator = function () {
	// get relative working directory
	var rwd = __dirname.substr(process.cwd().length + 1) + "/";
	// set up java process
	var javaHook = require("child_process").spawn("java", ["-cp", rwd, "DebugRNG"]);
	var inStream = javaHook.stdout;
	var outStream = javaHook.stdin;

	var waiting = false; //are we waiting for a response from the java process?
	var requestQueue = []; //queue up requests for a-sychronous yesness
	var buffer = ""; //buffer responses, because we don't know if we'll get the 
	                 //full response in one stream buffer item

	inStream.on("data", function (data) {
		buffer += data.toString();
		if (buffer.match(/.*\n$/)) {
			// we've seen EOL so pass the number to callback
			var off = requestQueue.shift(); // dequeue relevant request
			off.callback(parseInt(buffer, 10));
			// reset things
			buffer = "";
			waiting = false;
			_checkQueue();
		}		
	});
	
	/**
	 * Gets the next pseudo-random integer below n and passes it to callback
	 *
	 */
	var next = function (n, callback) {
		requestQueue.push({n: "" + n, callback: callback});
		_checkQueue();
	};

	// checks to see if there's anything waiting in the request queue.
	// if there is and we're not waiting for a response from the java process,
	// send it a new request.
	var _checkQueue = function () {
		if (!waiting && requestQueue.length > 0) {
			waiting = true;
			outStream.write(requestQueue[0].n + "\n");
		}
	};

	return {
		next: next,
		close: function () { outStream.write("q\n"); }
	};
};

exports.RandomNumberGenerator = RandomNumberGenerator;