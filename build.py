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

def compileModel(minimise):
	"""Compiles all of the model source files into one big file"""
	print "Compiling model...",
	try:
		source_files = [open("./src/model/"+f, "r") for f in model_src_files]
	except IOError:
		print "unable to open source file"
	for d in ["./build","./build/js"]:
		try:
			os.mkdir(d)
		except OSError:
			pass
	model = open("./build/js/model.js","w")
	model.write("var model = (function () {\n\n")
	[model.write(f.read()) for f in source_files]
	model.write("\n\ndelete exports.test_only;\n\nreturn exports;\n})();")
	model.close()
	print "done"
	if minimise:
		print "Minimising model...",
		model = open("./build/js/model.js","r")
		minmodel = open("./build/js/model.min.js","w")
		proc = subprocess.Popen(["jsmin","-l","3","./build/js/model.js"],
			                    stdout=minmodel, 
			                    shell=True)
		proc.wait()
		model.close()
		minmodel.close()
		os.remove("./build/js/model.js")
		os.rename("./build/js/model.min.js","./build/js/model.js")
		print "done"


def compileView():
	"""Compiles the view component"""
	print "Compiling view...",
	for d in ["./build","./build/img"]:
		try:
			os.mkdir(d)
		except OSError:
			pass
	# copy index.html
	shutil.copyfile("./src/view/index.html","./build/index.html")
	# copy bootstrap
	shutil.rmtree("./build/bootstrap", True)
	shutil.copytree("./src/view/bootstrap", "./build/bootstrap")
	# copy image folder
	shutil.rmtree("./build/img", True)
	shutil.copytree("./src/view/img", "./build/img")
	# compile style
	style = open("./build/style.css","w")
	proc = subprocess.Popen(["lessc","./src/view/style.less"],
		                    stdout=style, 
		                    shell=True)
	proc.wait()
	style.close()
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
	compileModel(("-m" in sys.argv))
	compileView()
	buildLog.close()