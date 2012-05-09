var imports = require("../../src/debug/DebugRNG.js");



var correctNumbers = [7193, 2932, 10386, 5575, 100, 15976, 430, 9740, 9449, 
                      1636, 11030, 9848, 13965, 16051, 14483, 6708, 5184, 15931,
                      7014, 461, 11371, 5856, 2136, 9139, 1684, 15900, 10236, 
                      13297, 1364, 6876, 15687, 14127, 11387, 13469, 11860, 
                      15589, 14209, 16327, 7024, 3297, 3120, 842, 12397, 9212,
                      5520, 4983, 7205, 7193, 4883, 7712, 6732, 7006, 10241, 
                      1012, 15227, 9910, 14119, 15124, 6010, 13191, 5820, 14074,
                      5582, 5297, 10387, 4492, 14468, 7879, 8839, 12668, 5436, 
                      8081, 4900, 10723, 10360, 1218, 11923, 3870, 12071, 3574, 
                      12232, 15592, 12909, 9711, 6638, 2488, 12725, 16145, 9746, 
                      9053, 5881, 3867, 10512, 4312, 8529, 1576, 15803, 5498, 
                      12730, 7397];

exports["Check that first 100 numbers are the same as in the project spec"] = function (test) {
	test.expect(100);
	var rng = new imports.RandomNumberGenerator();
	var results = 100;
	// timeout incase of badness
	var timeout = setTimeout(function(){
		rng.close();
		test.done();
	},3000);

	for (var i=0;i<100;i++) {
		rng.next(16384,function (expectedResult) {
			return function (result) {
				test.strictEqual(expectedResult,result,expectedResult+" expected, "+result+" seen");
				if (--results === 0) {
					rng.close();
					clearTimeout(timeout);
					test.done();
				}
			};
		}(correctNumbers[i]));
	}
};


var correctNumbers2 = [ 0, 0, 0, 3, 0, 4, 3, 4, 8, 6, 8, 8, 3, 7, 8, 4, 16, 1,
                        3, 1, 10, 4, 20, 19, 9, 14, 3, 25, 1, 6, 1, 15, 2, 5,
                        30, 1, 1, 25, 4, 17, 4, 2, 13, 16, 30, 15, 14, 41, 32,
                        12, 0, 38, 12, 40, 47, 54, 40, 44, 51, 51, 25, 0, 38,
                        49, 52, 4, 63, 59, 7, 68, 40, 17, 9, 67, 10, 2, 65, 48,
                        63, 54, 1, 12, 44, 51, 8, 80, 23, 41, 45, 53, 57, 3, 3,
                        82, 74, 40, 89, 10, 58, 97 ];

exports["Check that first 100 integers give the correct results"] = function (test) {
	test.expect(100);
	var rng = new imports.RandomNumberGenerator();
	var results = 100;
	// timeout incase of badness
	var timeout = setTimeout(function(){
		rng.close();
		test.done();
	},3000);

	for (var i=0;i<100;i++) {
		rng.next(i+1,function (expectedResult) {
			return function (result) {
				test.strictEqual(expectedResult,result,expectedResult+" expected, "+result+" seen");
				if (--results === 0) {
					rng.close();
					clearTimeout(timeout);
					test.done();
				}
			};
		}(correctNumbers2[i]));
	}
};