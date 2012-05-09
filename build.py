import subprocess, os, re, time
RUN_PATH = os.getcwd()

buildLog = open("build.log","w")

lint_errors = []
encountered_unit_test_errors = False

def runTests(path):
	global buildLog, encountered_unit_test_errors
	proc = subprocess.Popen(["nodeunit",path],
		                    stdout=buildLog, 
		                    stderr=subprocess.STDOUT, 
		                    shell=True)
	return_code = proc.wait()
	if return_code != 0:
		encountered_unit_test_errors=True


def lintFiles(path):
	"""Runs jshint to check the syntax of the file for goodness"""
	global lint_errors, buildLog
	try:
		subprocess.check_output(["jshint",path],shell=True)
	except subprocess.CalledProcessError as error:
		buildLog.write(error.output)
		output_lines = (re.findall(r'(.*)\n',error.output))
		lint_errors.extend(output_lines[:-2])

def printLintErrors():
	"""If lint errors have been found, prints them."""
	if len(lint_errors) > 0:
		print "LINT ERRORS"
		for error in lint_errors:
			print "   ",error

if __name__ == "__main__":
	lintFiles("./src/")
	lintFiles("./src/debug/")
	printLintErrors()
	runTests("./test/")
	runTests("./test/debug/")
	if encountered_unit_test_errors:
		print "Some file(s) failed test. See build log for details."
	buildLog.close()