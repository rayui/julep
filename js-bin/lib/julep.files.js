exports.getExtension = function(fn) {
	var ext = fn.match(/\.[A-Za-z0-9]{1,4}$/);
	if (ext) return ext.toString();
	return undefined;	
}
