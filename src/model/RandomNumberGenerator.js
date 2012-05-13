/**
 * A simple pseudo-random number generator object
 */
function RandomNumberGenerator() {
	return {
		/**
		 * Returns a pseudo-random number between 0 and n-1 inclusive
		 * @param n
		 */
		next: function (n) {
			return Math.floor(Math.random() * n);
		}
	};
}