var fs = require("fs");
var model_dir = __dirname+"/../../src/model/";

// concat model files
var model = [];
model.push(fs.readFileSync(model_dir+"AntGame.js","ascii"));
model.push(fs.readFileSync(model_dir+"Ant.js","ascii"));
model.push(fs.readFileSync(model_dir+"AntBrain.js","ascii"));
model.push(fs.readFileSync(model_dir+"WorldCell.js","ascii"));
model.push(fs.readFileSync(model_dir+"AntWorld.js","ascii"));
model.push(fs.readFileSync(model_dir+"AntWorldParser.js","ascii"));
model.push(fs.readFileSync(model_dir+"AntBrainParser.js","ascii"));
model = model.join("\n");

fs.writeFileSync(__dirname+"/model.qx", model, "ascii");

// import model
model = require("./model.qx");

// setup game vars
var rng = require("../../src/model/debug/DebugRNG.js").RandomNumberGenerator();

var sampleWorldFile = fs.readFileSync(__dirname+"/debug/tiny.world", "ascii");
var sampleBrainFile = fs.readFileSync(__dirname+"/debug/sample.ant", "ascii");

var world = model.AntWorld(model.parseAntWorld(sampleWorldFile));

var redBrain = model.AntBrain(model.parseAntBrain(sampleBrainFile),"red",rng);
var blackBrain = model.AntBrain(model.parseAntBrain(sampleBrainFile),"black",rng);

var game = model.AntGame(redBrain,blackBrain,world);

// open dump file to read states from
var dumpFile = fs.openSync(__dirname+"/debug/dump.all","r");
function worldStateReader() {
	var stateIndex = 0;
	var buffer = "";
	var stateArray = [];
	var lastState = "";
	var thisState = "";
	var splitRegex = /\n\nAfter round \d+\.\.\.\n/;
	var readKilobyte = function () {
		buffer += (fs.readSync(dumpFile, 1024, stateIndex*1024, "ascii"))[0];
		stateIndex++;
	};

	var getNextState = function () {
		if (stateArray.length === 0) {
			// if we've got no states to return
			// read some data in until we do
			do {
				readKilobyte();
				stateArray = buffer.split(splitRegex);
			} while (stateArray.length < 2);
			// put any excess data back into the buffer
			// we'll need it later
			buffer = stateArray.pop();
		}
		lastState = thisState;
		thisState = stateArray.shift();

		return thisState;
	};
	return {
		getNextState: getNextState,
		getLastState: function () { return lastState; }
	};
}

var wsr = worldStateReader();
wsr.getNextState(); // ignore first one

exports["Test that output matches the dump file"] = function (test) {
	test.expect(1);
	var worldState, dumpState;
	var count = 10000;
	for (var i = 0; i < count; i++) {
		worldState = world.toString();
		dumpState = wsr.getNextState();
		// when testing for equality, remove whitespace. Slows it down, but
		// figuring out how to fix my output so the whitespace is the same
		// was proving to be strangely difficult
		if (worldState.replace(/\s/g, "") !== dumpState.replace(/\s/g, "")) {
			console.log("Discrepancey detected at round " + i);
			console.log("last good state: ");
			console.log(wsr.getLastState());
			console.log("\n\nBad state:");
			console.log(worldState);
			console.log("\n\nShould be:");
			console.log(dumpState);

			break;
		} else {
			game.run(1);
		}
	}
	test.ok(i===count, "Output should match the dump file");

	test.done();
	fs.closeSync(dumpFile);
};
