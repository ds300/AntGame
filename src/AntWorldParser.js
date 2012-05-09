exports.test_only = exports.test_only || {};

function _parseGridLine(line, oddLine, supposedWidth) {
	if (oddLine) { // we're expecting a space at the start
		if (line.substr(0,1) !== " ") {
			throw new Error("No space at start of odd line");
		}
		// remove leading space and check no other spaces exist
		line = line.substr(1);
		if (line.substr(0,1 === " ")){
			throw new Error("Too much space at start of odd line");
		}
	} else {
		// even line so space is bad
		if (line.substr(0,1) === " ") {
			throw new Error("Unexpected space at start of even line");
		}
	}

	// get individual chars as array. trim trailing whitespace
	var chars = line.trim().split(/ /g);
	var numChars = chars.length;
	// check for correct width
	if (numChars != supposedWidth) {
		throw new Error("Grid width mismatch");
	}
	var cells = [];
	for (var i=0;i<numChars;i++) {
		// check for illegal cell identifiers
		if (!chars[i].match(/[1-9\-.+#]/)){
			throw new Error("Unrecognised cell identifier: "+chars[i]);
		}
		// append to cells list
		if (chars[i].match(/[1-9]/)){
			// food cell so change type to "f" and put value in another property
			cells.push({type: "f", quantity: parseInt(chars[i], 10)});
		} else {
			cells.push({type: chars[i]});
		}
	}
	return cells;
}

exports.test_only._parseGridLine = _parseGridLine;

function parseAntWorld(code, contestRules) {
	// replace windows and mac newlines with unix ones
	code = code.replace(/\r\n/g,"\n");
	code = code.replace(/\r/g,"\n");

	// split into lines
	var lines = code.split(/\n/g);
	// remove blank lines at the end
	while (lines[lines.length-1].trim() === ""){
		lines.splice(lines.length-1,1);
	}

	// check we have enough lines
	if ( (contestRules && numLines < 3 + 150)
	    || (!contestRules && numLines < 3 + 3) ) {
		throw new Error("Too few lines");
	}

	// get grid dimensions
	var dimens = lines.splice(0,2);
	var width = parseInt(dimens[0].trim(),10);
	var height = parseInt(dimens[1].trim(),10);
	if (!width || !height) {
		throw new Error("Could not parse world dimensions");
	}
	if (contestRules && (width !== 150 || height !== 150)) {
		throw new Error("Contest grids must be 150x150");
	}

	if (height !== lines.length) {
		throw new Error("Grid height does not match specified value");
	}

	// missing stuff here
}

exports.parseAntWorld = parseAntWorld;