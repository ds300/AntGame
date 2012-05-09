var imports = require("../src/AntWorldParser.js");
var parseAntWorld = imports.parseAntWorld;
var _parseGridLine = imports.test_only._parseGridLine;
var _isSurroundedByRock = imports.test_only._isSurroundedByRock;

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

var invalidOddLine1 = " 3 y . +";
var invalidOddLine2 = "  3 . # +";

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

exports["Test that _parseGridLine throws errors upon seeing invalid chars"] = function (test) {
	test.throws(function(){
		_parseGridLine(invalidOddLine1, true, 4);
	}, "this should throw an exception");
	test.done();
};

exports["Test that _parseGridLine throws errors upon seeing an odd line with too many spaces at the beginning"] = function (test) {
	test.throws(function(){
		_parseGridLine(invalidOddLine2, true, 4);
	}, "this should throw an exception");
	test.done();
};

var mockGridGood = {
	width: 5,
	height: 5,
	cells: [
		[{type:"#"},{type:"#"},{type:"#"},{type:"#"},{type:"#"}],
		[{type:"#"},{type:"."},{type:"."},{type:"."},{type:"#"}],
		[{type:"#"},{type:"+"},{type:"f", quantity: 5},{type:"-"},{type:"#"}],
		[{type:"#"},{type:"."},{type:"."},{type:"."},{type:"#"}],
		[{type:"#"},{type:"#"},{type:"#"},{type:"#"},{type:"#"}]
	]
};

var mockGridBad = {
	width: 5,
	height: 5,
	cells: [
		[{type:"#"},{type:"#"},{type:"#"},{type:"#"},{type:"#"}],
		[{type:"#"},{type:"."},{type:"."},{type:"."},{type:"#"}],
		[{type:"#"},{type:"+"},{type:"f", quantity: 5},{type:"-"},{type:"#"}],
		[{type:"#"},{type:"."},{type:"."},{type:"."},{type:"."}], // error is here
		[{type:"#"},{type:"#"},{type:"#"},{type:"#"},{type:"#"}]
	]
};

exports["Test that _isSurroundedByRock works"] = function (test) {
	test.expect(2);
	test.ok(_isSurroundedByRock(mockGridGood),"This grid is good");
	test.ok(!_isSurroundedByRock(mockGridBad),"This grid is bad");
	test.done();
};
