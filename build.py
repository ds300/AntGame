import subprocess, os, re, time, sys, shutil
RUN_PATH = os.getcwd()

buildLog = open("build.log","w")

model_src_files = [
	"Ant.js",
	"AntBrain.js",
	"AntBrainParser.js",
	"AntGame.js",
	"AntWorld.js",
	"AntWorldParser.js",
	"RandomNumberGenerator.js",
	"RandomWorldGenerator.js",
	"WorldCell.js"
]

model_test_files = [
	"debug/DebugRNG-test.js",
	"AntWorldParser-test.js",
	"AntBrainParser-test.js",
	"RandomWorldGenerator-test.js",
	"AntGame-test.js"
]

view_src_files = [
	"LogicalGroup.js",
	"ItemList.js",
	"BrainList.js",
	"WorldList.js",
	"Contest.js",
	"ContestSetup.js",
	"Editor.js",
	"Menu.js",
	"SingleMatch.js",
	"Game.js",
	"GfxUtils.js",
	"RunSans.js",
	"Init.js",
]

controller_src_files = [
	"Brains.js",
	"Worlds.js",
	"Editor.js",
	"Match.js",
	"Contest.js",
	"ContestSetup.js",
	"RunSans.js",
	"Run.js",
	"Menu.js",
	"ListHandler.js",
	"BrainList.js",
	"WorldList.js",
	"Init.js"
]

encountered_lint_errors = False
encountered_unit_test_errors = False

def runTests(path):
	"""runs nodeunit on the specified path"""
	print "running test:",path,"...",
	global buildLog, encountered_unit_test_errors
	proc = subprocess.Popen(["nodeunit",path],
		                    stdout=buildLog, 
		                    stderr=subprocess.STDOUT, 
		                    shell=True)
	return_code = proc.wait()
	if return_code != 0:
		encountered_unit_test_errors=True
	print "done"

def compileComponent(src_files, root_dir, output_path):
	files = ["header.js"] + src_files + ["footer.js"]
	files = [root_dir + filename for filename in files]
	try:
		files = [open(path,"r") for path in files]
		out = open(output_path, "w")
		[out.write(f.read()) for f in files]
		out.close()
		[f.close() for f in files]
	except IOError:
		print "unable to open source files"
		sys.exit(1)

def compileModel():
	"""Compiles all of the model source files into one big file"""
	print "Compiling model...",
	# create directory structure
	compileComponent(model_src_files,"./src/model/","./build/js/model.js")
	print "done"



def compileView():
	"""Compiles the view component"""
	print "Compiling view...",
	compileComponent(view_src_files,"./src/view/","./build/js/view.js")
	# compile style
	style = open("./build/style.css","w")
	proc = subprocess.Popen(["lessc","./src/view/style.less"],
		                    stdout=style, 
		                    shell=True)
	proc.wait()
	style.close()
	print "done"


def compileController():
	print "Compiling controller...",
	compileComponent(controller_src_files,
		"./src/controller/",
		"./build/js/controller.js")
	print "done"


def copyBuildDirTree():
	print "Copying build directory tree...",
	shutil.rmtree("./build", True)
	shutil.copytree("./src/view/dirTree", "./build")
	print "done"

if __name__ == "__main__":
	# lint and test
	if "-s" not in sys.argv:
		[runTests("./test/model/"+f) for f in model_test_files]
		if encountered_unit_test_errors:
			print "Some file(s) failed test. See build log for details."
		else:
			print "All tests passed! Congrats!"
	copyBuildDirTree()
	compileModel()
	compileView()
	compileController();
	buildLog.close()