var imports = require("../src/AntWorldParser.js");
var parseAntWorld = imports.parseAntWorld;
var _parseGridLine = imports.test_only._parseGridLine;

var validEvenLine = "# 1 5 . # 9 - +  ";
var validEvenLine_expected = [
	{type: "#"},
	{type: "f", quantity: 1},
	{type: "f", quantity: 5},
	{type: "."},
	{type: "#"},
	{type: "f", quantity: 9},
	{type: "-"},
	{type: "+"}
];

var validOddLine = " 1 # . + -";
var validOddLine_expected = [
	{type: "f", quantity: 1},
	{type: "#"},
	{type: "."},
	{type: "+"},
	{type: "-"}
];

exports["Test that _parseGridLine works for valid input"] = function (test) {
	test.expect(2);
	test.deepEqual(
		_parseGridLine(validEvenLine, false, 8),
		validEvenLine_expected, 
		"these should be equal");
	test.deepEqual(
		_parseGridLine(validOddLine, true, 5),
		validOddLine_expected, 
		"these should be equal");
	test.done();
};

exports["Test that _parseGridLine throws errors if odd and even lines are swapped"] = function (test) {
	test.expect(2);
	test.throws(function(){
		_parseGridLine(validEvenLine, true, 8);
	}, "this should throw an exception");
	test.throws(function(){
		_parseGridLine(validOddLine, false, 5);
	}, "this should throw an exception");
	test.done();
};

exports["Test that _parseGridLine throws errors on width mismatch"] = function (test) {
	test.expect(2);
	test.throws(function(){
		_parseGridLine(validOddLine, true, 4);
	}, "this should throw an exception");
	test.throws(function(){
		_parseGridLine(validEvenLine, false, 9);
	}, "this should throw an exception");
	test.done();
};


