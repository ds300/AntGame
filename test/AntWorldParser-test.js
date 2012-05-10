var imports = require("../src/AntWorldParser.js");
var parseAntWorld = imports.parseAntWorld;
var _parseGridLine = imports.test_only._parseGridLine;
var _isSurroundedByRock = imports.test_only._isSurroundedByRock;
var _gridContains = imports.test_only._gridContains;
var _gridContains = imports.test_only._gridContains;
var _getAdjacentCoord = imports.test_only._getAdjacentCoord;
var _getElementCoords = imports.test_only._getElementCoords;
var _getElementBox = imports.test_only._getElementBox;
var _getElements = imports.test_only._getElements;
var _cloneBox = imports.test_only._cloneBox;
var _cropBox = imports.test_only._cropBox;
var _attemptBoxIntersection = imports.test_only._attemptBoxIntersection;
var _containsLegalFoodBlobs = imports.test_only._containsLegalFoodBlobs;
var _isLegalHill = imports.test_only._isLegalHill;

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

exports["Test that _gridContains works"] = function (test) {
	test.expect(6);
	test.ok(_gridContains(mockGridGood,"#"), "The grid contains rock");
	test.ok(_gridContains(mockGridGood,"."), "The grid contains clear cells");
	test.ok(_gridContains(mockGridGood,"+"), "The grid contains red hill");
	test.ok(_gridContains(mockGridGood,"-"), "The grid contains black hill");
	test.ok(_gridContains(mockGridGood,"f"), "The grid contains food");
	test.ok(!_gridContains(mockGridGood,"g"), "The grid doesn't contain 'g'");
	test.done();
};

exports["Test that _getAdjacentCoord works"] = function (test) {
	test.expect(12);
	test.deepEqual(_getAdjacentCoord(1,1,0),{row:1,col:2},"going right from odd row");
	test.deepEqual(_getAdjacentCoord(1,1,1),{row:2,col:2},"going down and right from odd row");
	test.deepEqual(_getAdjacentCoord(1,1,2),{row:2,col:1},"going down and left from odd row");
	test.deepEqual(_getAdjacentCoord(1,1,3),{row:1,col:0},"going left from odd row");
	test.deepEqual(_getAdjacentCoord(1,1,4),{row:0,col:1},"going up and left from odd row");
	test.deepEqual(_getAdjacentCoord(1,1,5),{row:0,col:2},"going up and right from odd row");

	test.deepEqual(_getAdjacentCoord(2,1,0),{row:2,col:2},"going right from even row");
	test.deepEqual(_getAdjacentCoord(2,1,1),{row:3,col:1},"going down and right from even row");
	test.deepEqual(_getAdjacentCoord(2,1,2),{row:3,col:0},"going down and left from even row");
	test.deepEqual(_getAdjacentCoord(2,1,3),{row:2,col:0},"going left from even row");
	test.deepEqual(_getAdjacentCoord(2,1,4),{row:1,col:0},"going up and left from even row");
	test.deepEqual(_getAdjacentCoord(2,1,5),{row:1,col:1},"going up and right from even row");
	test.done();
};

// the following two arrays represents contiguous areas of coordinates in 
// the good/bad mock grids which have type ".";
var expectedCoordsGood = ["1:1","1:2","1:3"];
var expectedCoordsBad = ["3:1","3:2","3:3","3:4"];
exports["Test that _getElementCoords works"] = function (test) {
	test.expect(7);
	function testGrid(grid,row,col,expectedCoords) {
		var coords = _getElementCoords(grid,row,col);
		for (var i = 0; i < coords.length; i++){
			var c = coords[i];
			test.ok(expectedCoords.indexOf(c.row + ":" + c.col) >= 0,"yes");
		}
	}
	testGrid(mockGridGood,1,1,expectedCoordsGood);
	testGrid(mockGridBad,3,3,expectedCoordsBad);

	test.done();
};

var crossCoords = [{row:5,col:6},{row:6,col:5},
                   {row:6,col:7},{row:7,col:6}];
// should look like this:
//   +
//  + +
//   +
var crossArray = [[false,true,false],
                  [true,false,true],
                  [false,true,false]];

var expectedBox = {config: crossArray, topRow: 5};
exports["Test that _getElementBox works"] = function (test) {
	test.expect(1);
	test.deepEqual(_getElementBox(crossCoords),expectedBox,"should be equal");
	test.done();
};

var expectedElements = [
	{config: [[true,true,true]], topRow: 1},
	{config: [[true,true,true,true]], topRow: 3}
];

exports["Test that _getElements works"] = function (test) {
	test.expect(1);
	test.deepEqual(_getElements(mockGridBad,"."),expectedElements, "should be equal");
	test.done();
};




/**** food stuffs *****/


exports["Test that _cloneBox works"] = function (test) {
	test.expect(2);
	var clone = _cloneBox(expectedBox);
	test.deepEqual(clone,expectedBox,"The clone should have the same structure");
	test.notStrictEqual(clone,expectedBox,"The clone should not be the same object");
	test.done();
};

var boxToCrop = _cloneBox(expectedBox);
boxToCrop.config.unshift([false,false,false]); // add row at top
boxToCrop.topRow--;
boxToCrop.config.push([false,false,false]); // add row at bottom
for (var i=0;i<boxToCrop.config.length;i++) {
	boxToCrop.config[i].unshift(false); // add col at left
	boxToCrop.config[i].push(false); // add col at right
}

var emptyBox = {
	config: [
		[false,false,false],
		[false,false,false],
		[false,false,false]
	],
	topRow: 0
};

exports["Test that _cropBox works"] = function (test) {
	test.expect(2);
	var cropped = _cropBox(boxToCrop);
	test.deepEqual(expectedBox,cropped,"cropped box should have same structure");
	test.deepEqual(_cropBox(emptyBox),{config:[],topRow:3}, "cropped box should be empty");
	test.done();
};

var overlay = [
	[true, false],
	[false, true]
];

exports["Test that _attemptBoxIntersection works"] = function (test) {
	test.expect(3);
	var output = _attemptBoxIntersection(expectedBox,overlay);
	test.ok(!!output,"The function should not return undefined");
	test.deepEqual(output.config, overlay, "The function should return a cropped version of anything left over after intersection.");
	test.strictEqual(output.topRow,expectedBox.topRow+1);
	test.done();
};

function booleanify(arr, targetType) {
	for (var i = 0; i < arr.length; i++) {
		arr[i] = _parseGridLine(arr[i],i%2===1,arr[i].length/2);
		for (var j = 0; j < arr[i].length; j++) {
			arr[i][j] = arr[i][j].type === targetType;
		}
	}
	return arr;
}

var legalFood = [[], [], []];
legalFood[0].push("5 5 5 5 5 . . . ");
legalFood[0].push(" 5 5 5 5 5 . . .");
legalFood[0].push(". 5 5 5 5 5 . . ");
legalFood[0].push(" . 5 5 5 5 5 . .");
legalFood[0].push(". . 5 5 5 5 5 . ");
legalFood[0] = {config: booleanify(legalFood[0], "f"), topRow: 2};

legalFood[1].push("5 5 5 5 5 . . . . . . . . ");
legalFood[1].push(" 5 5 5 5 5 4 4 4 4 4 . . .");
legalFood[1].push(". 5 5 5 5 5 4 4 4 4 4 . . ");
legalFood[1].push(" . 5 5 5 5 5 4 4 4 4 4 . .");
legalFood[1].push(". . 5 5 5 5 5 4 4 4 4 4 . ");
legalFood[1].push(" . . . . . . . 4 4 4 4 4 .");
legalFood[1] = {config: booleanify(legalFood[1], "f"), topRow: 2};

legalFood[2].push(". . . . . . . . . . . . . . ");
legalFood[2].push(" . . . . . . . . . 5 5 5 5 5");
legalFood[2].push(". . . . . 3 . . . 5 5 5 5 5 ");
legalFood[2].push(" . . . . 3 3 . . 5 5 5 5 5 .");
legalFood[2].push(". . . . 3 3 3 . 5 5 5 5 5 . ");
legalFood[2].push(" . . . 3 3 3 3 5 5 5 5 5 . .");
legalFood[2].push(". . . 3 3 3 3 3 . . . . . . ");
legalFood[2].push(" . . . 3 3 3 3 . . . . . . .");
legalFood[2].push(". . . . 3 3 3 . . . . . . . ");
legalFood[2].push(" . . . . 3 3 . . . . . . . .");
legalFood[2].push("5 5 5 5 5 3 . . . . . . . . ");
legalFood[2].push(" 5 5 5 5 5 4 4 4 4 4 . . . .");
legalFood[2].push(". 5 5 5 5 5 4 4 4 4 4 . . . ");
legalFood[2].push(" . 5 5 5 5 5 4 4 4 4 4 . . .");
legalFood[2].push(". . 5 5 5 5 5 4 4 4 4 4 . . ");
legalFood[2].push(" . . . . . . . 4 4 4 4 4 . .");
legalFood[2] = _cropBox({config: booleanify(legalFood[2], "f"), topRow: 2});

var illegalFood = [[], [], []];
illegalFood[0].push("5 5 5 5 5 . . . ");
illegalFood[0].push(" 5 5 5 5 5 . . .");
illegalFood[0].push(". 5 5 5 5 5 . . ");
illegalFood[0].push(" . 5 5 5 5 5 . .");
illegalFood[0].push(". . . 5 5 5 5 . ");
illegalFood[0] = {config: booleanify(illegalFood[0], "f"), topRow: 2};

illegalFood[1].push("5 5 5 5 5 . . . . . . . . ");
illegalFood[1].push(" 5 5 5 5 5 4 4 4 4 4 . . .");
illegalFood[1].push(". 5 5 5 5 5 4 4 4 4 . . . ");
illegalFood[1].push(" . 5 5 5 5 5 4 4 4 4 4 . .");
illegalFood[1].push(". . 5 5 5 5 5 4 4 4 4 4 . ");
illegalFood[1].push(" . . . . . . . 4 4 4 4 4 .");
illegalFood[1] = {config: booleanify(illegalFood[1], "f"), topRow: 2};

illegalFood[2].push(". . . . . . . . . . . . . . ");
illegalFood[2].push(" . . . . . . . . . 5 5 5 5 5");
illegalFood[2].push(". . . . . 3 . . . 5 5 5 5 5 ");
illegalFood[2].push(" . . . . 3 3 . . 5 5 5 5 5 .");
illegalFood[2].push(". . . . 3 3 3 . 5 5 5 5 5 . ");
illegalFood[2].push(" . . . 3 3 3 3 5 5 5 5 5 . .");
illegalFood[2].push(". . . 3 3 3 3 3 . . . . . . ");
illegalFood[2].push(" . . . 3 3 3 3 . . . . . . .");
illegalFood[2].push(". . . . 3 3 3 . . . . . . . ");
illegalFood[2].push(" . . . . 3 3 . . . . . . . .");
illegalFood[2].push("5 5 5 5 5 3 . . . . . . . . ");
illegalFood[2].push(" 5 5 5 5 5 4 4 4 4 4 . . . .");
illegalFood[2].push(". 5 5 5 5 5 4 4 . 4 4 . . . ");
illegalFood[2].push(" . 5 5 5 5 5 4 4 4 4 4 . . .");
illegalFood[2].push(". . 5 5 5 5 5 4 4 4 4 4 . . ");
illegalFood[2].push(" . . . . . . . 4 4 4 4 4 . .");
illegalFood[2] = _cropBox({config: booleanify(illegalFood[2], "f"), topRow: 2});



exports["Test that _containsLegalFoodBlobs works for legal blobs"] = function (test) {
	test.expect(3);
	for (var i=0;i<3;i++) {
		test.ok(_containsLegalFoodBlobs(legalFood[i]), "These blobs are legal");
	}
	test.done();
};

exports["Test that _containsLegalFoodBlobs works for illegal blobs"] = function (test) {
	test.expect(3);
	for (var i=0;i<3;i++) {
		test.ok(!_containsLegalFoodBlobs(illegalFood[i]), "These blobs are illegal");
	}
	test.done();
};

var goodHill = [[], []];
// box starting on even row
goodHill[0].push(". . . - - - - - - - . . . ");
goodHill[0].push(" . . - - - - - - - - . . .");
goodHill[0].push(". . - - - - - - - - - . . ");
goodHill[0].push(" . - - - - - - - - - - . .");
goodHill[0].push(". - - - - - - - - - - - . ");
goodHill[0].push(" - - - - - - - - - - - - .");
goodHill[0].push("- - - - - - - - - - - - - ");
goodHill[0].push(" - - - - - - - - - - - - .");
goodHill[0].push(". - - - - - - - - - - - . ");
goodHill[0].push(" . - - - - - - - - - - . .");
goodHill[0].push(". . - - - - - - - - - . . ");
goodHill[0].push(" . . - - - - - - - - . . .");
goodHill[0].push(". . . - - - - - - - . . . ");
goodHill[0] = {config: booleanify(goodHill[0], "-"), topRow: 2};

// bo- starting on odd row
goodHill[1].push(". . . . . . . . . . . . . ")
goodHill[1].push(" . . . - - - - - - - . . .");
goodHill[1].push(". . . - - - - - - - - . . ");
goodHill[1].push(" . . - - - - - - - - - . .");
goodHill[1].push(". . - - - - - - - - - - . ");
goodHill[1].push(" . - - - - - - - - - - - .");
goodHill[1].push(". - - - - - - - - - - - - ");
goodHill[1].push(" - - - - - - - - - - - - -");
goodHill[1].push(". - - - - - - - - - - - - ");
goodHill[1].push(" . - - - - - - - - - - - .");
goodHill[1].push(". . - - - - - - - - - - . ");
goodHill[1].push(" . . - - - - - - - - - . .");
goodHill[1].push(". . . - - - - - - - - . . ");
goodHill[1].push(" . . . - - - - - - - . . .");
goodHill[1] = _cropBox({config: booleanify(goodHill[1], "-"), topRow: 2});

var badHill = [[], []];
// box starting on even row
badHill[0].push(". . . + + + + + + + . . . ");
badHill[0].push(" . . + + + + + + + + . . .");
badHill[0].push(". . + + + + + + + + + . . ");
badHill[0].push(" . + + + + + + + + + + . .");
badHill[0].push(". + + + + + + + + + + + . ");
badHill[0].push(" + + + + + + + + + + + + .");
badHill[0].push("+ + + + + + + . + + + + + ");
badHill[0].push(" + + + + + + + + + + + + .");
badHill[0].push(". + + + + + + + + + + + . ");
badHill[0].push(" . + + + + + + + + + + . .");
badHill[0].push(". . + + + + + + + + + . . ");
badHill[0].push(" . . + + + + + + + + . . .");
badHill[0].push(". . . + + + + + + + . . . ");
badHill[0] = {config: booleanify(badHill[0], "+"), topRow: 2};

// bo+ starting on odd row
badHill[1].push(". . . . . . . . . . . . . ")
badHill[1].push(" . . . + + + + + + + . . .");
badHill[1].push(". . . + + + + + + + + . . ");
badHill[1].push(" . . + + + + + + + + + . .");
badHill[1].push(". . + + + + + + + + + + . ");
badHill[1].push(" . + + + + + + + + + + + .");
badHill[1].push(". + + + + + + + + + + + + ");
badHill[1].push(" . + + + + + + + + + + + +");
badHill[1].push(". + + + + + + + + + + + + ");
badHill[1].push(" . + + + + + + + + + + + .");
badHill[1].push(". . + + + + + + + + + + . ");
badHill[1].push(" . . + + + + + + + + + . .");
badHill[1].push(". . . + + + + + + + + . . ");
badHill[1].push(" . . . + + + + + + + . . .");
badHill[1] = _cropBox({config: booleanify(badHill[1], "+"), topRow: 2});

exports["Test that _isLegalHill works"] = function (test) {
	test.expect(4);
	test.ok(_isLegalHill(goodHill[0]), "this hill is legal on even row");
	test.ok(_isLegalHill(goodHill[1]), "this hill is legal on odd row");
	test.ok(!_isLegalHill(badHill[0]), "this hill is illegal on even row");
	test.ok(!_isLegalHill(badHill[1]), "this hill is illegal on odd row");
	test.done();
};

var fs = require("fs");

try {
	var goodMap = fs.readFileSync(__dirname+"/maps/goodMap.dat","ascii");
	var badMaps = [];
	badMaps.push(fs.readFileSync(__dirname+"/maps/badMap-foodNum.dat","ascii"));
	badMaps.push(fs.readFileSync(__dirname+"/maps/badMap-foodNum2.dat","ascii"));
	badMaps.push(fs.readFileSync(__dirname+"/maps/badMap-foodShape.dat","ascii"));
	badMaps.push(fs.readFileSync(__dirname+"/maps/badMap-hillShape.dat","ascii"));
	badMaps.push(fs.readFileSync(__dirname+"/maps/badMap-rockNum.dat","ascii"));
	badMaps.push(fs.readFileSync(__dirname+"/maps/badMap-rockTouchingHill.dat","ascii"));
	badMaps.push(fs.readFileSync(__dirname+"/maps/badMap-hillTouchingHill.dat","ascii"));

} catch (err) {
	console.log(err);
}


exports["Test that a contest-legal world parses without error"] = function (test) {
	test.doesNotThrow(function(){parseAntWorld(goodMap, true)});
	test.done();
};


exports["Test that bad maps throw errors"] = function (test) {
	test.expect(7);
	for (var i=0;i<badMaps.length;i++) {
		test.throws(function(){parseAntWorld(badMaps[i], true)});
	}
	test.done();
};

