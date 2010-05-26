exports.bind = bind = function(scope, fn) {
	return function () {
		fn.apply(scope, arguments);
	};
};
