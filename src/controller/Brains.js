/**
 * These are the builtin brains
 */
var BRAINS = [];

BRAINS.push({
	name: "Advanced Brain",
	preset: true,
	source: 
	"Flip 10 6 1" + "\n" +
	"Flip 6 27 2" + "\n" +
	"Flip 5 24 3" + "\n" +
	"Flip 4 9 4" + "\n" +
	"Flip 3 14 5" + "\n" +
	"Flip 2 19 23" + "\n" +
	"Flip 2 7 8" + "\n" +
	"Turn Left 0" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 76 10" + "\n" +
	"Flip 5 75 11" + "\n" +
	"Flip 4 74 12" + "\n" +
	"Flip 3 73 13" + "\n" +
	"Flip 2 71 72" + "\n" +
	"Flip 6 70 15" + "\n" +
	"Flip 5 69 16" + "\n" +
	"Flip 4 68 17" + "\n" +
	"Flip 3 67 18" + "\n" +
	"Flip 2 65 66" + "\n" +
	"PickUp 20 0" + "\n" +
	"Turn Right 21" + "\n" +
	"Turn Right 22" + "\n" +
	"Turn Right 0" + "\n" +
	"Drop 0" + "\n" +
	"Flip 4 56 25" + "\n" +
	"Flip 3 47 26" + "\n" +
	"Flip 2 29 38" + "\n" +
	"Move 0 28" + "\n" +
	"Turn Left 0" + "\n" +
	"Flip 10 139 30" + "\n" +
	"Flip 9 132 31" + "\n" +
	"Flip 8 125 32" + "\n" +
	"Flip 7 118 33" + "\n" +
	"Flip 6 111 34" + "\n" +
	"Flip 5 104 35" + "\n" +
	"Flip 4 99 36" + "\n" +
	"Flip 3 91 37" + "\n" +
	"Flip 2 77 84" + "\n" +
	"Flip 10 208 39" + "\n" +
	"Flip 9 201 40" + "\n" +
	"Flip 8 194 41" + "\n" +
	"Flip 7 187 42" + "\n" +
	"Flip 6 180 43" + "\n" +
	"Flip 5 173 44" + "\n" +
	"Flip 4 168 45" + "\n" +
	"Flip 3 160 46" + "\n" +
	"Flip 2 146 153" + "\n" +
	"Flip 10 277 48" + "\n" +
	"Flip 9 270 49" + "\n" +
	"Flip 8 263 50" + "\n" +
	"Flip 7 256 51" + "\n" +
	"Flip 6 249 52" + "\n" +
	"Flip 5 242 53" + "\n" +
	"Flip 4 237 54" + "\n" +
	"Flip 3 229 55" + "\n" +
	"Flip 2 215 222" + "\n" +
	"Flip 10 346 57" + "\n" +
	"Flip 9 339 58" + "\n" +
	"Flip 8 332 59" + "\n" +
	"Flip 7 325 60" + "\n" +
	"Flip 6 318 61" + "\n" +
	"Flip 5 311 62" + "\n" +
	"Flip 4 306 63" + "\n" +
	"Flip 3 298 64" + "\n" +
	"Flip 2 284 291" + "\n" +
	"Unmark 4 0" + "\n" +
	"Unmark 5 0" + "\n" +
	"Unmark 3 0" + "\n" +
	"Unmark 2 0" + "\n" +
	"Unmark 1 0" + "\n" +
	"Unmark 0 0" + "\n" +
	"Mark 4 0" + "\n" +
	"Mark 5 0" + "\n" +
	"Mark 3 0" + "\n" +
	"Mark 2 0" + "\n" +
	"Mark 1 0" + "\n" +
	"Mark 0 0" + "\n" +
	"Sense LeftAhead 0 78 Home" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 363 80" + "\n" +
	"Flip 5 361 81" + "\n" +
	"Flip 4 359 82" + "\n" +
	"Flip 3 357 83" + "\n" +
	"Flip 2 353 355" + "\n" +
	"Sense LeftAhead 0 85 FoeHome" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 363 87" + "\n" +
	"Flip 5 361 88" + "\n" +
	"Flip 4 359 89" + "\n" +
	"Flip 3 357 90" + "\n" +
	"Flip 2 353 355" + "\n" +
	"Sense LeftAhead 0 92 FoeMarker" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 363 94" + "\n" +
	"Flip 5 361 95" + "\n" +
	"Flip 4 359 96" + "\n" +
	"Flip 3 357 97" + "\n" +
	"Flip 2 353 355" + "\n" +
	"Flip 1 99 99" + "\n" +
	"Flip 6 363 100" + "\n" +
	"Flip 5 361 101" + "\n" +
	"Flip 4 359 102" + "\n" +
	"Flip 3 357 103" + "\n" +
	"Flip 2 353 355" + "\n" +
	"Sense LeftAhead 0 105 Rock" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 363 107" + "\n" +
	"Flip 5 361 108" + "\n" +
	"Flip 4 359 109" + "\n" +
	"Flip 3 357 110" + "\n" +
	"Flip 2 353 355" + "\n" +
	"Sense LeftAhead 0 112 Food" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 363 114" + "\n" +
	"Flip 5 361 115" + "\n" +
	"Flip 4 359 116" + "\n" +
	"Flip 3 357 117" + "\n" +
	"Flip 2 353 355" + "\n" +
	"Sense LeftAhead 0 119 FoeWithFood" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 363 121" + "\n" +
	"Flip 5 361 122" + "\n" +
	"Flip 4 359 123" + "\n" +
	"Flip 3 357 124" + "\n" +
	"Flip 2 353 355" + "\n" +
	"Sense LeftAhead 0 126 FriendWithFood" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 363 128" + "\n" +
	"Flip 5 361 129" + "\n" +
	"Flip 4 359 130" + "\n" +
	"Flip 3 357 131" + "\n" +
	"Flip 2 353 355" + "\n" +
	"Sense LeftAhead 0 133 Foe" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 363 135" + "\n" +
	"Flip 5 361 136" + "\n" +
	"Flip 4 359 137" + "\n" +
	"Flip 3 357 138" + "\n" +
	"Flip 2 353 355" + "\n" +
	"Sense LeftAhead 0 140 Friend" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 363 142" + "\n" +
	"Flip 5 361 143" + "\n" +
	"Flip 4 359 144" + "\n" +
	"Flip 3 357 145" + "\n" +
	"Flip 2 353 355" + "\n" +
	"Sense RightAhead 0 147 Home" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 375 149" + "\n" +
	"Flip 5 373 150" + "\n" +
	"Flip 4 371 151" + "\n" +
	"Flip 3 369 152" + "\n" +
	"Flip 2 365 367" + "\n" +
	"Sense RightAhead 0 154 FoeHome" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 375 156" + "\n" +
	"Flip 5 373 157" + "\n" +
	"Flip 4 371 158" + "\n" +
	"Flip 3 369 159" + "\n" +
	"Flip 2 365 367" + "\n" +
	"Sense RightAhead 0 161 FoeMarker" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 375 163" + "\n" +
	"Flip 5 373 164" + "\n" +
	"Flip 4 371 165" + "\n" +
	"Flip 3 369 166" + "\n" +
	"Flip 2 365 367" + "\n" +
	"Flip 1 168 168" + "\n" +
	"Flip 6 375 169" + "\n" +
	"Flip 5 373 170" + "\n" +
	"Flip 4 371 171" + "\n" +
	"Flip 3 369 172" + "\n" +
	"Flip 2 365 367" + "\n" +
	"Sense RightAhead 0 174 Rock" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 375 176" + "\n" +
	"Flip 5 373 177" + "\n" +
	"Flip 4 371 178" + "\n" +
	"Flip 3 369 179" + "\n" +
	"Flip 2 365 367" + "\n" +
	"Sense RightAhead 0 181 Food" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 375 183" + "\n" +
	"Flip 5 373 184" + "\n" +
	"Flip 4 371 185" + "\n" +
	"Flip 3 369 186" + "\n" +
	"Flip 2 365 367" + "\n" +
	"Sense RightAhead 0 188 FoeWithFood" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 375 190" + "\n" +
	"Flip 5 373 191" + "\n" +
	"Flip 4 371 192" + "\n" +
	"Flip 3 369 193" + "\n" +
	"Flip 2 365 367" + "\n" +
	"Sense RightAhead 0 195 FriendWithFood" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 375 197" + "\n" +
	"Flip 5 373 198" + "\n" +
	"Flip 4 371 199" + "\n" +
	"Flip 3 369 200" + "\n" +
	"Flip 2 365 367" + "\n" +
	"Sense RightAhead 0 202 Foe" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 375 204" + "\n" +
	"Flip 5 373 205" + "\n" +
	"Flip 4 371 206" + "\n" +
	"Flip 3 369 207" + "\n" +
	"Flip 2 365 367" + "\n" +
	"Sense RightAhead 0 209 Friend" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 375 211" + "\n" +
	"Flip 5 373 212" + "\n" +
	"Flip 4 371 213" + "\n" +
	"Flip 3 369 214" + "\n" +
	"Flip 2 365 367" + "\n" +
	"Sense Ahead 0 216 Home" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 387 218" + "\n" +
	"Flip 5 385 219" + "\n" +
	"Flip 4 383 220" + "\n" +
	"Flip 3 381 221" + "\n" +
	"Flip 2 377 379" + "\n" +
	"Sense Ahead 0 223 FoeHome" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 387 225" + "\n" +
	"Flip 5 385 226" + "\n" +
	"Flip 4 383 227" + "\n" +
	"Flip 3 381 228" + "\n" +
	"Flip 2 377 379" + "\n" +
	"Sense Ahead 0 230 FoeMarker" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 387 232" + "\n" +
	"Flip 5 385 233" + "\n" +
	"Flip 4 383 234" + "\n" +
	"Flip 3 381 235" + "\n" +
	"Flip 2 377 379" + "\n" +
	"Flip 1 237 237" + "\n" +
	"Flip 6 387 238" + "\n" +
	"Flip 5 385 239" + "\n" +
	"Flip 4 383 240" + "\n" +
	"Flip 3 381 241" + "\n" +
	"Flip 2 377 379" + "\n" +
	"Sense Ahead 0 243 Rock" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 387 245" + "\n" +
	"Flip 5 385 246" + "\n" +
	"Flip 4 383 247" + "\n" +
	"Flip 3 381 248" + "\n" +
	"Flip 2 377 379" + "\n" +
	"Sense Ahead 0 250 Food" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 387 252" + "\n" +
	"Flip 5 385 253" + "\n" +
	"Flip 4 383 254" + "\n" +
	"Flip 3 381 255" + "\n" +
	"Flip 2 377 379" + "\n" +
	"Sense Ahead 0 257 FoeWithFood" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 387 259" + "\n" +
	"Flip 5 385 260" + "\n" +
	"Flip 4 383 261" + "\n" +
	"Flip 3 381 262" + "\n" +
	"Flip 2 377 379" + "\n" +
	"Sense Ahead 0 264 FriendWithFood" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 387 266" + "\n" +
	"Flip 5 385 267" + "\n" +
	"Flip 4 383 268" + "\n" +
	"Flip 3 381 269" + "\n" +
	"Flip 2 377 379" + "\n" +
	"Sense Ahead 0 271 Foe" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 387 273" + "\n" +
	"Flip 5 385 274" + "\n" +
	"Flip 4 383 275" + "\n" +
	"Flip 3 381 276" + "\n" +
	"Flip 2 377 379" + "\n" +
	"Sense Ahead 0 278 Friend" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 387 280" + "\n" +
	"Flip 5 385 281" + "\n" +
	"Flip 4 383 282" + "\n" +
	"Flip 3 381 283" + "\n" +
	"Flip 2 377 379" + "\n" +
	"Sense Here 0 285 Home" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 399 287" + "\n" +
	"Flip 5 397 288" + "\n" +
	"Flip 4 395 289" + "\n" +
	"Flip 3 393 290" + "\n" +
	"Flip 2 389 391" + "\n" +
	"Sense Here 0 292 FoeHome" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 399 294" + "\n" +
	"Flip 5 397 295" + "\n" +
	"Flip 4 395 296" + "\n" +
	"Flip 3 393 297" + "\n" +
	"Flip 2 389 391" + "\n" +
	"Sense Here 0 299 FoeMarker" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 399 301" + "\n" +
	"Flip 5 397 302" + "\n" +
	"Flip 4 395 303" + "\n" +
	"Flip 3 393 304" + "\n" +
	"Flip 2 389 391" + "\n" +
	"Flip 1 306 306" + "\n" +
	"Flip 6 399 307" + "\n" +
	"Flip 5 397 308" + "\n" +
	"Flip 4 395 309" + "\n" +
	"Flip 3 393 310" + "\n" +
	"Flip 2 389 391" + "\n" +
	"Sense Here 0 312 Rock" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 399 314" + "\n" +
	"Flip 5 397 315" + "\n" +
	"Flip 4 395 316" + "\n" +
	"Flip 3 393 317" + "\n" +
	"Flip 2 389 391" + "\n" +
	"Sense Here 0 319 Food" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 399 321" + "\n" +
	"Flip 5 397 322" + "\n" +
	"Flip 4 395 323" + "\n" +
	"Flip 3 393 324" + "\n" +
	"Flip 2 389 391" + "\n" +
	"Sense Here 0 326 FoeWithFood" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 399 328" + "\n" +
	"Flip 5 397 329" + "\n" +
	"Flip 4 395 330" + "\n" +
	"Flip 3 393 331" + "\n" +
	"Flip 2 389 391" + "\n" +
	"Sense Here 0 333 FriendWithFood" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 399 335" + "\n" +
	"Flip 5 397 336" + "\n" +
	"Flip 4 395 337" + "\n" +
	"Flip 3 393 338" + "\n" +
	"Flip 2 389 391" + "\n" +
	"Sense Here 0 340 Foe" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 399 342" + "\n" +
	"Flip 5 397 343" + "\n" +
	"Flip 4 395 344" + "\n" +
	"Flip 3 393 345" + "\n" +
	"Flip 2 389 391" + "\n" +
	"Sense Here 0 347 Friend" + "\n" +
	"Turn Right 0" + "\n" +
	"Flip 6 399 349" + "\n" +
	"Flip 5 397 350" + "\n" +
	"Flip 4 395 351" + "\n" +
	"Flip 3 393 352" + "\n" +
	"Flip 2 389 391" + "\n" +
	"Sense LeftAhead 0 354 Marker 4" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense LeftAhead 0 356 Marker 5" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense LeftAhead 0 358 Marker 3" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense LeftAhead 0 360 Marker 2" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense LeftAhead 0 362 Marker 1" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense LeftAhead 0 364 Marker 0" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense RightAhead 0 366 Marker 4" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense RightAhead 0 368 Marker 5" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense RightAhead 0 370 Marker 3" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense RightAhead 0 372 Marker 2" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense RightAhead 0 374 Marker 1" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense RightAhead 0 376 Marker 0" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense Ahead 0 378 Marker 4" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense Ahead 0 380 Marker 5" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense Ahead 0 382 Marker 3" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense Ahead 0 384 Marker 2" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense Ahead 0 386 Marker 1" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense Ahead 0 388 Marker 0" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense Here 0 390 Marker 4" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense Here 0 392 Marker 5" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense Here 0 394 Marker 3" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense Here 0 396 Marker 2" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense Here 0 398 Marker 1" + "\n" +
	"Turn Right 0" + "\n" +
	"Sense Here 0 400 Marker 0" + "\n" +
	"Turn Right 0" + "\n" 

});

BRAINS.push({
	name: "Primitive Brain",
	preset: true,
	source: 
		"Sense Ahead 1 3 Food" + "\n" +
		"Move 2 0" + "\n" +
		"PickUp 8 0" + "\n" +
		"Flip 3 4 5" + "\n" +
		"Turn Left 0" + "\n" +
		"Flip 2 6 7" + "\n" +
		"Turn Right 0" + "\n" +
		"Move 0 3" + "\n" +
		"Sense Ahead 9 11 Home " + "\n" +
		"Move 10 8" + "\n" +
		"Drop 0" + "\n" +
		"Flip 3 12 13" + "\n" +
		"Turn Left 8" + "\n" +
		"Flip 2 14 15" + "\n" +
		"Turn Right 8" + "\n" +
		"Move 8 11" + "\n" 
});