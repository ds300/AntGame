var fs = require("fs");

// concat model files
var model = [];
model.push(fs.readFileSync(__dirname+"/../../src/AntGame.js","ascii"));
model.push(fs.readFileSync(__dirname+"/../../src/Ant.js","ascii"));
model.push(fs.readFileSync(__dirname+"/../../src/AntBrain.js","ascii"));
model.push(fs.readFileSync(__dirname+"/../../src/WorldCell.js","ascii"));
model.push(fs.readFileSync(__dirname+"/../../src/AntWorld.js","ascii"));
model = model.join("\n");

fs.writeFileSync(__dirname+"/model.qx", model, "ascii");

model = require("./model.qx");

var parseAntBrain = require("../../src/AntBrainParser.js").parseAntBrain;
var parseAntWorld = require("../../src/AntWorldParser.js").parseAntWorld;
var RandomNumberGenerator = require("../../src/debug/DebugRNG.js").RandomNumberGenerator;
var rng = new RandomNumberGenerator();

var sampleWorldFile = fs.readFileSync(__dirname+"/tiny.world", "ascii");
var sampleBrainFile = fs.readFileSync(__dirname+"/sample.ant", "ascii");

var world = new model.AntWorld(parseAntWorld(sampleWorldFile));

var redBrain = new model.AntBrain(parseAntBrain(sampleBrainFile),"red",rng);
var blackBrain = new model.AntBrain(parseAntBrain(sampleBrainFile),"black",rng);

var game = new model.AntGame(redBrain,blackBrain,world);

var dumpFile = fs.openSync(__dirname+"/dump.all","r");

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
			do {
				readKilobyte();
				stateArray = buffer.split(splitRegex);
			} while (stateArray.length < 2);
			//console.log(stateArray);
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
	var count = 10;
	for (var i = 0; i < count; i++) {
		worldState = world.toString();
		dumpState = wsr.getNextState();
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
