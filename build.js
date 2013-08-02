var rules = Packages.tablesaw.rules;
var tablesaw = Packages.tablesaw;
var redline = Packages.org.freecompany.redline;

var project = 'jslate';
var version = '1.0';
var release = '1'; //package release number
var installBase = '/opt/'+project;
var buildDir = 'build';
var rpmFile = project + '-' + version + '-' + release + '.rpm';
var srcRpmFile = project + '-' + version + '-' + release + '.src.rpm';

var buildDirRule = new rules.DirectoryRule("build");

var rpmRule = new rules.SimpleRule('build-rpm')
		.addTarget(buildDir+'/'+rpmFile)
		.setMakeAction('doRPM')
		.addDepend(buildDirRule)
		.alwaysRun();
	
function addFileSetToRPM(builder, destination, fileSet)
{
	var paths = fileSet.getFiles();
	
	for (var i = 0; i < paths.size(); i++)
	{
		var path = paths.get(i); 
		//print('Adding '+path);
		var f = new java.io.File(path.getBaseDir(), path.getFile());
		builder.addFile(destination + "/" + path.getFile(), f)
	}
}
	
function doRPM(rule)
{
	var host = java.net.InetAddress.getLocalHost().getHostName();
	//print(host);
	
	var rpmBuilder = new redline.Builder();
	rpmBuilder.setDescription('description goes here');
	rpmBuilder.setGroup('Applications/Internet');
	rpmBuilder.setLicense('license');
	rpmBuilder.setPackage(project, version, release);
	rpmBuilder.setPlatform(redline.header.Architecture.NOARCH, redline.header.Os.LINUX);
	rpmBuilder.setSummary('summary');
	rpmBuilder.setType(redline.header.RpmType.BINARY);
	rpmBuilder.setUrl('http://proofpoint.com');
	rpmBuilder.setVendor('Proofpoint Inc.');
	rpmBuilder.setProvides(project);
	rpmBuilder.setBuildHost(host);
	rpmBuilder.setSourceRpm(srcRpmFile);
	
	//Adding dependencies
	rpmBuilder.addDependencyMore('httpd', '2');
	rpmBuilder.addDependencyMore('php53', '5.3');
	rpmBuilder.addDependencyMore('php53-mysql', '5');
	
	addFileSetToRPM(rpmBuilder, installBase+'/app', new tablesaw.RegExFileSet('app', '.*').recurse());
	addFileSetToRPM(rpmBuilder, installBase+'/lib', new tablesaw.RegExFileSet('lib', '.*').recurse());
	addFileSetToRPM(rpmBuilder, installBase+'/plugins', new tablesaw.RegExFileSet('plugins', '.*').recurse());
	
	rpmBuilder.addFile(installBase+'/index.php', new java.io.File('index.php'));
	rpmBuilder.addFile(installBase+'/.htaccess', new java.io.File('.htaccess'));
	rpmBuilder.addFile('/etc/httpd/conf.d/jslate.conf', new java.io.File('etc/jslate.conf'));

	//Post install script to set owner to apache
	rpmBuilder.setPostInstallScript(new java.io.File("etc/post_install.sh"));
	//rpmBuilder.setPreUninstallScript(new File("src/scripts/install/pre_uninstall.sh"));
	
	print("Building RPM "+rule.getTarget())
	var outputFile = new java.io.FileOutputStream(rule.getTarget())
	rpmBuilder.build(outputFile.getChannel())
	outputFile.close()
}

saw.setDefaultTarget('build-rpm');


