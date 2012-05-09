exports.test_only = exports.test_only || {};

// standard error wrapper to include line number
function BrainParseError(message, line) {  
    var err = new Error(message + " at line " + line);
    err.line = line;
    return err;
} 

/********** helper functions **********/

function _parseInt(string) {
	// strip preceding zeroes
	while (string.length > 1 && string.substr(0, 1) === "0") {
		string = string.substr(1);
	}
	return parseInt(string, 10);
}

exports.test_only._parseInt = _parseInt;

// the following functions evaluate a line and, if it represents a valid 
// instruction, return a state object. Otherwise they return undefined.
var instrParsers = {};

// Sense instructions
instrParsers['Se'] = function (line) {
	var match = line.trim().match(/^Sense (Ahead|LeftAhead|RightAhead|Here) (\d+) (\d+) (Friend|Foe|FriendWithFood|FoeWithFood|Food|Rock|FoeMarker|Home|FoeHome|Marker \d)$/);
	if (match) {
		var condition = match[4];
		var marker = -1;
		// if the sense condition is 'Marker', we need to extract the
		// relevant marker id
		if (condition.indexOf("Marker") === 0) {
			marker = _parseInt(condition.substr(7, 1));
			condition = "Marker";
		}
		return {
			type: "Sense",
			dir: match[1],
			condition: condition,
			marker: marker,
			st1: _parseInt(match[2]),
			st2: _parseInt(match[3])
		};
	} 
};

// Mark/Unmark instructions
instrParsers['Un'] = instrParsers['Ma'] = function (line) {
	var match = line.trim().match(/^(Mark|Unmark) (\d+) (\d+)$/);
	if (match) {
		return {
			type: match[1],
			st: _parseInt(match[3]),
			marker: _parseInt(match[2])
		};
	} 
};

// PickUp/Move instructions
instrParsers['Pi'] = instrParsers['Mo'] = function (line) {
	var match = line.trim().match(/^(PickUp|Move) (\d+) (\d+)$/);
	if (match) {
		return {
			type: match[1],
			st1: _parseInt(match[2]),
			st2: _parseInt(match[3])
		};
	}
};

// Drop instructions
instrParsers['Dr'] = function (line) {
	var match = line.trim().match(/^Drop (\d+)$/);
	if (match) {
		return {
			type: "Drop",
			st: _parseInt(match[1])
		};
	}
};

// Turn instructions
instrParsers['Tu'] = function (line) {
	var match = line.trim().match(/^Turn (Left|Right) (\d+)$/);
	if (match) {
		return {
			type: "Turn",
			dir: match[1],
			st: _parseInt(match[2])
		};
	}
};

// Flip instructions
instrParsers['Fl'] = function (line) {
	var match = line.trim().match(/^Flip (\d+) (\d+) (\d+)$/);
	if (match) {
		return { 
			type: "Flip",
			p: _parseInt(match[1]),
			st1: _parseInt(match[2]),
			st2: _parseInt(match[3])
		};
	}
};

function _parseLine(line) {
	var firstTwoChars = line.trim().substr(0, 2);
	return instrParsers[firstTwoChars] && instrParsers[firstTwoChars](line);
}

exports.test_only._parseLine = _parseLine;

/**
 * This function parses ant brain code and returns a list of state objects.
 *
 */
function parseAntBrain(code) {
	// replace windows and mac newlines with unix ones
	code = code.replace(/\r\n/g, "\n");
	code = code.replace(/\r/g, "\n");

	// split into lines
	var lines = code.split(/\n/g);
	var numLines = lines.length;

	// convert lines to states
	var states = [];

	// for every line
	for (var i = 0; i < numLines; i++) {
		// try and turn it into a state
		var state = _parseLine(lines[i]);
		// if we were successful, add the state to 
		// the array, otherwise error
		if (state) {
			state.line = i + 1; // for use with error checking below
			states.push(state);
		} else {
			if (lines[i].trim().length > 0) { // ignore empty lines
				var msg = "Malformed Instruction: '" + lines[i] + "'";
				throw new BrainParseError(msg, i + 1);
			}
		}
		if (states.length > 1000) {
			throw new BrainParseError("Too many states. Limit is 1000.", i + 1);
		}
	}

	if (states.length === 0) {
		throw new BrainParseError("No states given", 1);
	}

	// we need to check if there are too many states or if there are any
	// instructions which point to nonexistent states or any marker ids > 5
	var highestStateIndex = states.length - 1;
	for (var i = 0; i <= highestStateIndex; i++) {
		var x = states[i].st || 0;
		var y = states[i].st1 || 0;
		var z = states[i].st2 || 0;
		var s = Math.max(x, y, z);
		if (s > highestStateIndex) {
			var msg = "Pointer to state '" + s + "'' which doesn't exist";
			throw new BrainParseError(msg, states[i].line);
		}
		var marker = states[i].marker || 0;
		if (marker > 5) {
			var msg = "Marker id '" + marker + "' too high";
			throw new BrainParseError(msg, states[i].line);
		}
		// we don't need the 'line' property any more
		delete states[i].line;
	}

	// all good so
	return states;
}

exports.parseAntBrain = parseAntBrain;