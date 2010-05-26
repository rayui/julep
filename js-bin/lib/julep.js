/*basic framework config */

exports.init = function() {
	return {
		sys:require('sys'),
		fs:require('fs'),
		http:require('http'),
		mime:require('./julep.mime'),
		object:require('./julep.object'),
		events:require('./julep.events'),
		files:require('./julep.files'),
		crypt:require('./md5'),
		config:require('./julep.config'),
		log:require('./julep.log'),
		httpServe:require('./julep.httpServe'),
		httpProxy:require('./julep.httpProxy')
	}
};

