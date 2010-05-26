/* raybot analytical logging proxy server */

$ = require('./lib/julep').init();

var config = $.config.load("conf/proxy.conf");

$.proxy = $.httpProxy.spawn();
$.proxy.configure(config.proxy);
$.proxy.init();

$.logserver = $.httpServe.spawn();
$.logserver.configure(config.logserver);
$.logserver.init();
