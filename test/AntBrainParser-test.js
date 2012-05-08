var imports = require("../src/AntBrainParser.js");
var parseAntBrain = imports.parseAntBrain;

var goodBrain = [
	"", // empty lines to see if they get ignored
	"Flip 6 5 1",
	"Turn Right 0",
	"Drop 1",
	"",
	"PickUp 2 7",
	"Unmark 3 5",
	"Mark 3 4",
	"Sense LeftAhead 0 3 Rock",
	"Sense RightAhead 2 8 Marker 4",
	"Move 1 2",
	"",
];

var expectedGoodBrain = [
	{type: "Flip", p: 6, st1: 5, st2: 1},
	{type: "Turn", dir: "Right", st: 0},
	{type: "Drop", st: 1},
	{type: "PickUp", st1: 2, st2: 7},
	{type: "Unmark", marker: 3, st: 5},
	{type: "Mark", marker: 3, st: 4},
	{type: "Sense", dir: "LeftAhead", st1: 0, st2: 3, condition: "Rock", marker: -1},
	{type: "Sense", dir: "RightAhead", st1: 2, st2: 8, condition: "Marker", marker: 4},
	{type: "Move", st1: 1, st2: 2}
];

// we want to test with windows, mac and unix newlines, so...
var goodBrainWindows = goodBrain.join("\r\n");
var goodBrainMac = goodBrain.join("\r");
var goodBrainUnix = goodBrain.join("\n");

exports["Test that the parser works for Windows newlines."] = function (test) {
	test.deepEqual(parseAntBrain(goodBrainWindows),expectedGoodBrain,"parsing with Windows newlines");
	test.done();
};

exports["Test that the parser works for Mac newlines."] = function (test) {
	test.deepEqual(parseAntBrain(goodBrainMac),expectedGoodBrain,"parsing with Mac newlines");
	test.done();
};

exports["Test that the parser works for Unix newlines."] = function (test) {
	test.deepEqual(parseAntBrain(goodBrainUnix),expectedGoodBrain,"parsing with Unix newlines");
	test.done();
};