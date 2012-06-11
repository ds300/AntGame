/**
 * These are the builtin brains
 */
var BRAINS = [];

BRAINS.push({
	name: "Advanced Brain",
	preset: true,
	source: 
		"Flip 0 1 1\n" +
		"Move 5 2\n" +
		"Flip 2 3 4\n" +
		"Turn Left 1\n" +
		"Turn Right 1\n" +
		"Sense Here 11 6 Food\n" +
		"Sense Here 31 7 FoeHome\n" +
		"Flip 6 8 1\n" +
		"Flip 2 9 10\n" +
		"Turn Left 1\n" +
		"Turn Right 1\n" +
		"PickUp 12 12\n" +
		"Move 16 13\n" +
		"Flip 2 14 15\n" +
		"Turn Left 12\n" +
		"Turn Right 12\n" +
		"Sense Here 21 17 Home\n" +
		"Flip 6 18 12\n" +
		"Flip 2 19 20\n" +
		"Turn Left 12\n" +
		"Turn Right 12\n" +
		"Drop 22\n" +
		"Move 26 23\n" +
		"Flip 2 24 25\n" +
		"Turn Left 22\n" +
		"Turn Right 22\n" +
		"Sense Here 27 1 Home\n" +
		"Flip 6 28 22\n" +
		"Flip 2 29 30\n" +
		"Turn Left 22\n" +
		"Turn Right 22\n" +
		"Sense Here 36 32 Food\n" +
		"Sense Ahead 51 33 FoeHome\n" +
		"Flip 2 34 35\n" +
		"Turn Left 32\n" +
		"Turn Right 32\n" +
		"PickUp 37 37\n" +
		"Move 41 38\n" +
		"Flip 2 39 40\n" +
		"Turn Left 22\n" +
		"Turn Right 22\n" +
		"Sense Here 42 46 FoeHome\n" +
		"Flip 6 43 37\n" +
		"Flip 2 44 45\n" +
		"Turn Left 22\n" +
		"Turn Right 22\n" +
		"Drop 47\n" +
		"Turn Right 48\n" +
		"Turn Right 49\n" +
		"Turn Right 50\n" +
		"Move 31 1\n" +
		"Move 31 52\n" +
		"Flip 2 53 54\n" +
		"Turn Left 31\n" +
		"Turn Right 31\n"
});

BRAINS.push({
	name: "Primitive Brain",
	preset: true,
	source: 
		"Move 4 1\n" +
		"Flip 2 2 3\n" +
		"Turn Left 0\n" +
		"Turn Right 0\n" +
		"Sense Here 9 5 Food\n" +
		"Flip 6 6 0\n" +
		"Flip 2 7 8\n" +
		"Turn Left 0\n" +
		"Turn Right 0\n" +
		"PickUp 10 10\n" +
		"Move 14 11\n" +
		"Flip 2 12 13\n" +
		"Turn Left 10\n" +
		"Turn Right 10\n" +
		"Sense Here 19 15 Home\n" +
		"Flip 6 16 10\n" +
		"Flip 2 17 18\n" +
		"Turn Left 10\n" +
		"Turn Right 10\n" +
		"Drop 20\n" +
		"Move 24 21\n" +
		"Flip 2 22 23\n" +
		"Turn Left 20\n" +
		"Turn Right 20\n" +
		"Sense Here 25 0 Home\n" +
		"Flip 6 26 20\n" +
		"Flip 2 27 28\n" +
		"Turn Left 20\n" +
		"Turn Right 20\n" 
});