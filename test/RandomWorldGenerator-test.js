var imports = require("../src/RandomWorldGenerator.js");


var generateRandomWorld = imports.generateRandomWorld;
var _superimpose = imports.test_only._superimpose;

var imports = require("../src/AntWorldParser.js");
var parseAntWorld = imports.parseAntWorld;

var testGrid = [
	[".",".",".","."],
	  [".",".",".","."],
	[".",".","#","#"],
	  [".",".","#","#"]
];

var testShape = [
	  ["O","*"],
	["O","."]
];

var expectedGrid = [
	[".",".",".","."],
	  [".","+",".","."],
	[".","+","#","#"],
	  [".",".","#","#"]
];

exports["Test that _superimpose works"] = function (test) {
	test.expect(3);
	test.ok(!_superimpose(testGrid,testShape,2,1,"+"),"This should not work");
	test.ok(_superimpose(testGrid,testShape,1,1,"+"),"This should work.");
	test.deepEqual(testGrid,expectedGrid,"These should now be equal");
	test.done();
};

exports["Test thtat generateRandomWorld returns valid contest worlds"] = function (test) {
	test.expect(5);
	for (var i=0;i<5;i++){
		test.doesNotThrow(function(){parseAntWorld(generateRandomWorld(),true);});
	}
	test.done();
};
