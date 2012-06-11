AntGame
=======

In order to build this you will need the following things installed and in your path:

* node.js (latest stable)
* nodeunit (from npm (node package manager; ships with the latest node builds))
* lessc (from npm)
* python (latest 2.x release)

You also need to unpack the file ./test/debug/dump.all.gz to run the behaviour test.

in the root directory, run:

    python build.py

add the -s flag to skip tests

The folder ./build will be created with all of the relevant files

To see a working demo, [go here](http://teamgood.github.com/antgame)