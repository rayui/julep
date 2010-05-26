/*http server code */

//default config - overriden if this.configPath set
exports.config = {
	port:8000,
	root:'/www/node',
	log:{}
};

exports.response = {};
exports.request = {};

exports.respond200 = function(data) {
	var mimeType = $.mime.lookupExtension($.files.getExtension(this.request.url));
	this.response.writeHead(200, {
		'Content-Type': mimeType,
		'Content-Length':data.length
	});
	this.response.write(data, "binary");
	this.response.end();
	
	var log = {
		request:{
			url:this.request.url,
			headers:this.request.headers,
			remoteIP:this.request.connection.remoteAddress
		},
		response:{
			headers:this.response.headers
		}
	}
	
	this.log.access.put(log);
};

exports.respond404 = function(err) {
	this.log.access.put("404: " + this.request.url);
	this.response.writeHead(404, {'Content-Type': 'text/plain'});
	this.response.write("404 - "  + this.request.url + " " + err);
	this.response.end();
	
	var log = {
		request:{
			url:this.request.url,
			headers:this.request.headers,
			remoteIP:this.request.connection.remoteAddress
		},
		response:{
			headers:this.response.headers
		}
	}
	
	this.log.access.put(log);
};

exports.fileCallBack = function(err, data) {
	if (err) {
		this.respond404(err);
		return false;
	} else {
		this.respond200(data);
	}
};

exports.listen = function(port) {
	if (!this.server) {return false};
		
	if (port) {
		this.config.port = port;
	}

	this.server.listen(this.config.port);
	this.log.error.put("Server listening on port " + parseInt(this.config.port), 1);
}

exports.configure = function(config) {
	//configure 
	if (config) {
		this.config = config;
	}
	
	//enable logging
	this.log = {};
	
	this.log.error = $.log.spawn();
	this.log.error.configure(this.config.log.error);
	this.log.error.init();
	
	this.log.access = $.log.spawn();
	this.log.access.configure(this.config.log.access);
	this.log.access.init();	
	
}
	
exports.init = function() {

	var that = this;
	
	//start server
	this.server = $.http.createServer(function (request, response) {
		that.request = request;
		that.response = response;
		
		$.fs.readFile(that.config.root + that.request.url, "binary", bind(that, that.fileCallBack));
		
	});
	
	this.log.error.put('Started http server at 127.0.0.1 with document root ' + this.config.root);
	this.listen();
	
	return this;
	
};
