import subprocess, os, re, time, sys
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

if __name__ == "__main__":
	if "-s" not in sys.argv:
		[lintFiles("./src/model/"+f) for f in model_src_files]
		[runTests("./test/model/"+f) for f in model_test_files]
	printLintErrors()

	if encountered_unit_test_errors:
		print "Some file(s) failed test. See build log for details."
	else:
		print "All tests passed! Congrats!"
	buildLog.close()