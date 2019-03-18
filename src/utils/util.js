var Util = {
	isString: function (str) {
		return typeof str === 'string';
	},

	isArray: function (arr) {
		return arr instanceof Array;
	},

	isFunction: function (fn) {
		return typeof fn === 'function';
	},

	isObject: function (object) {
		return object instanceof Object;
	},

	error: function (type, info) {
		throw (type + ':' + info);
	},

	warn: function (type, info) {
		console.warn(type + ':' + info);
	}
};

