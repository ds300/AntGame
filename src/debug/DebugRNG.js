var BigInteger = require("./biginteger.js").BigInteger;
function RandomNumberGenerator() {
	var seed = BigInteger("12345");
	var multi = BigInteger("22695477");
	var one = BigInteger("1");
	var divi = BigInteger("65536");
	var modi = BigInteger("16384");
	var maxint = BigInteger("2147483648");
	var twomaxint = maxint.multiply(2);
	var x;

	function next(n) {
		seed = seed.multiply(multi).add(one).add(maxint).remainder(twomaxint);
		if (seed.isNegative()) {seed = seed.add(twomaxint); }
		seed = seed.subtract(maxint);
		if (n === 0) { return 0; }
		x = seed.divide(divi).remainder(modi);
		if (x.isNegative()) { x = x.add(modi).subtract(one); }
		return x.remainder(BigInteger(n.toString())).valueOf();
	}
	next(5);
	next(5);
	next(5);
	return {next: next};
}
// var rng = new RandomNumberGenerator();
// for (var i=0; i<100; i++) {
// 	console.log(rng.next(i+1));
// }
exports.RandomNumberGenerator = RandomNumberGenerator;