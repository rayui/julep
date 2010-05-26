exports.load = function(filename) {
	
	//routine to 'sensibly' load config for objects
	
	if (filename) {
		var confStr = $.fs.readFileSync(filename); //we do a synchronous load as it doesn't hurt at startup and makes our job easier
		if (confStr) {
			var confObj = JSON.parse(confStr);
			if (confObj) {
				return confObj; //only return anything if it loads happily
			}
		}
			
	} else {
		//return false and let the program decide what it wants to do if there is no config available
		//modules should probably use their in-built defaults?
		return false;
	}
	
}
