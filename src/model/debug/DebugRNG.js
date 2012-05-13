var BigInteger = require("./biginteger.js").BigInteger;
// var use = require("./nums.js").use;
// var expect = require("./randnums.js").nums;
function RandomNumberGenerator() {
	var seed = BigInteger("12345");
	var multi = BigInteger("22695477");
	var one = BigInteger("1");
	var maxint = BigInteger("2147483648");
	var twomaxint = maxint.multiply(2);
	var x;

	function next(n) {

		seed = seed.multiply(multi).add(one).add(maxint).remainder(twomaxint);
		if (seed.isNegative()) {seed = seed.add(twomaxint); }
		seed = seed.subtract(maxint);
		if (n === 0) { return 0; }
		x = Math.floor(seed.valueOf() / 65536);
		x = ((x % 16384) + 16384) % 16384; 
		var result = x % n;
		return result;
	}
	next(5);
	next(5);
	next(5);
	return {next: next};
}
exports.RandomNumberGenerator = RandomNumberGenerator;
