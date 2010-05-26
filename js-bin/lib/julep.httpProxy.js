/*http proxy code */

//default config - overriden if this.configPath set
exports.config = {
	port:8001,
	clientPort:80,
	log:{
		access:{
			logFile:"/www/node/log/proxy.access.log",
			logLevel:1,
			consoleEcho:true
		},
		error:{
			logFile:"/www/node/log/proxy.error.log",
			logLevel:1,
			consoleEcho:true
		}
	}
};

exports.clientCallBack = function(serveReq, serveRes) {

	this.client = $.http.createClient(parseInt(this.config.clientPort), serveReq.headers.host).request(serveReq.method, serveReq.url, serveReq.headers);
	var that = this;
	
	this.client.addListener("response", function (response) {
			
		/*if (response.headers.hasOwnProperty("set-cookie")) {
			that.log.error.put("removing response set cookie header");
			delete response.headers["set-cookie"];
		}*/
			
		response.addListener("data", function (chunk) {
			//serve browser client what we normally would
			try {
				that.log.error.put("1");
				serveRes.write(chunk);
			}
			catch (err) {
				that.log.error.put(err);
			}
		});
		
		response.addListener("end", function () {
			//create log of pertinent information
			
			that.log.error.put("heard end");
			
			var result = {
				//md5 hash user agent and salt with ip address to get unique id for each browser/ip combination
				clientID: $.crypt.md5($.crypt.md5(serveReq.headers["user-agent"]) + serveReq.connection.remoteAddress.toString("binary")),
				request: {
					url: serveReq.url,
					headers: serveReq.headers,
					remoteIP:serveReq.connection.remoteAddress
				},
				response: {
					headers:response.headers
				}
			};
			that.log.access.put(result);
			try {
				that.log.error.put("2");
				serveRes.end();
			}
			catch (err) {
				that.log.error.put(err);
			}
		});
		
		try {
			that.log.error.put("3");
			serveRes.writeHead(response.statusCode, response.headers);
		}
		catch (err) {
			that.log.error.put(err);
		}
	});
	
	serveReq.addListener('data', function(chunk) {
		try {
			that.log.error.put("4");
			that.client.write(chunk);
		}
		catch (err) {
			that.log.error.put(err);
		}
	});
	serveReq.addListener('end', function() {
		try {
			that.log.error.put("5");
			that.client.end();
		}
		catch (err) {
			that.log.error.put(err);
		}
	});
	
	return this;
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
	
	this.log.access = $.log.spawn();
	this.log.access.configure(this.config.log.access);
		
	return this;
	
}
	
exports.init = function() {

	this.log.error.init();
	this.log.access.init();
	
	//start server
	this.server = $.http.createServer(bind(this, this.clientCallBack));
	this.server.listen(this.config.port);
		
	return this;
	
};
