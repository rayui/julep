/*log file gubbins */
/*best behaviour for the log is not to bother intialising it, just have it running and forget about it*/

exports.config = {
	logFile:"./default.log",
	logLevel:3,
	consoleEcho:false
}

exports.state = {
	index:0
}

exports.openCallBack = function(err, fd) {
	if (err) {
		this.output = undefined;
		$.sys.puts("Warning! No log file specified! System error: " + err);
	} else {
		this.output = fd;
	}
};

exports.writeCallBack = function(err, written) {
	if (err) {
		$.sys.puts("Warning! Could not write to log file!");
	}
};

exports.put = function(data, level) {
	if (!level) {
		level = 1;
	}
	
	if (level <= this.config.logLevel) {
		var log = {
			index:this.state.index,
			data:data
		};
		log = JSON.stringify(log);
		if (this.output) {
			$.fs.write(this.output, log, undefined, undefined, bind(this, this.writeCallBack));
		}
		if (this.config.consoleEcho) {
			$.sys.puts(log);
		}
		
		//incremenet log index
		this.state.index++;
	}
};

exports.configure = function(config) {
	//configure 
	if (config) {
		this.config = config;
	}
};

exports.init = function() {
	if (this.config.logLevel > 0) {
		if (this.config.logFile) {
			$.fs.open(this.config.logFile, "a", undefined, bind(this, this.openCallBack));
		}
	}
	
	this.put("Started logging");
	
	return this;
};
