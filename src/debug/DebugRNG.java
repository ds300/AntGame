import java.io.*;
/**
 * This class describes a pseudo-random number generator which behaves in the
 * fashion of that described in the project specification. It is used for
 * debugging purposes. There exists a javascript interface to this program.
 * See ./DebugRNG.js
 * The reason behind implementing this in Java is that it supports integer
 * overflow. Javascript does not, and using an arbitrary-precision library 
 * would be very very slow. I might try re-implementing this in C because 
 * node has a very sane way to interface with C code.
 */
public class DebugRNG {
	private long seed = 12345;

	//make these instance variables to keep the garbage collector happy
	private long x; 
	private int result;

	/**
	 * Constructor
	 */
	public DebugRNG() {
		for (int i=0;i<3;i++) next(1);
	}

	/**
	 * Returns a pseudo-random number from 0 to n
	 * @param n n
	 */
	public int next(int n){
		seed = seed*22695477 + 1;
		x = ((seed/65536) % 16384);
		if (x < 0) {
			x += 16383;
		}
		return (int)(x%n);
	}

	public static void main(String[] args) throws Exception{
		DebugRNG rng = new DebugRNG();
		BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
		String input = in.readLine();
		while (!input.equals("q")) {
			System.out.println(rng.next(Integer.parseInt(input)));
			input = in.readLine();
		}
	}
}