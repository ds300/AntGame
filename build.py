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
	"Components.js",
	"Game.js"
]

controller_src_files = [
	"Init.js",
	"Contest.js",
	"Match.js",
	"Menu.js"
]

lint_errors = []
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


def lintFiles(path):
	"""Runs jshint to check the syntax of the file for goodness"""
	print "linting:",path,"...",
	global lint_errors, buildLog
	try:
		subprocess.check_output(["jshint",path],shell=True)
	except subprocess.CalledProcessError as error:
		buildLog.write(path+" Lint Errors:\n\n"+error.output)
		output_lines = (re.findall(r'(.*)\n',error.output))
		lint_errors.extend(output_lines[:-2])
	print "done"

def printLintErrors():
	"""If lint errors have been found, prints them."""
	if len(lint_errors) > 0:
		print "LINT ERRORS"
		for error in lint_errors:
			print "   ",error

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

def minimiseJSFile(path):
	try:
		outputFile = open(path+".tmp","w")
		proc = subprocess.Popen(["jsmin","-l","3",path],
			                    stdout=minmodel, 
			                    shell=True)
		proc.wait()
		outputFile.close()
		os.remove(path)
		os.rename(path+".tmp",path)
	except OSError:
		"unable to remove or rename"
	except IOError:
		"unable to open file", path

def compileModel(minimise=False):
	"""Compiles all of the model source files into one big file"""
	print "Compiling model...",
	# create directory structure
	compileComponent(model_src_files,"./src/model/","./build/js/model.js")
	print "done"
	if minimise:
		print "Minimising model...",
		minimiseJSFile("./build/js/model.js")
		print "done"


def compileView(minimise=False):
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
	if minimise:
		print "Minimising view...",
		minimiseJSFile("./build/js/view.js")
		print "done"

def compileController(minimise=False):
	print "Compiling controller...",
	compileComponent(controller_src_files,
		"./src/controller/",
		"./build/js/controller.js")
	print "done"
	if minimise:
		print "Minimising controller...",
		minimiseJSFile("./build/js/controller.js")
		print "done"

def copyBuildDirTree():
	print "Copying build directory tree...",
	shutil.rmtree("./build", True)
	shutil.copytree("./src/view/dirTree", "./build")
	print "done"

if __name__ == "__main__":
	# lint and test
	if "-s" not in sys.argv:
		[lintFiles("./src/model/"+f) for f in model_src_files]
		[runTests("./test/model/"+f) for f in model_test_files]
		printLintErrors()
		if encountered_unit_test_errors:
			print "Some file(s) failed test. See build log for details."
		else:
			print "All tests passed! Congrats!"
	copyBuildDirTree()
	compileModel(("-m" in sys.argv))
	compileView()
	compileController();
	buildLog.close()