function defineMixin(RModule) {
	/**
	 * 定义模块及其依赖
	 * @param name  {String}  模块名
	 * @param deps  {Array}   依赖模块数组，若不是数组，则视为模块实现，忽略之后的参数
	 * @param impl  {function}模块实现
	 */

	RModule.prototype.define = function (name, deps, impl) {

		if (!name || !Util.isString(name)) {
			return Util.error(_GError.ParamInvali, "模块命名必须定义，类型为字符串！");
		}

		if (!Util.isArray(deps)) {
			impl = deps;
			deps = [];
		}

		if (!Util.isFunction(impl)) {
			return Util.error(_GError.ParamInvali, '请正确定义模块' + name + '!');
		}

		if (_GModules.hasOwnProperty(name)) {
			return Util.warn(_GWarn.ModuleDupli, name + '不能重复定义！');
		}

		var i = 0;
		var len = deps.length;
		var dep = null;

		for (; i < len; i++) {
			dep = deps[i];
			if (!_GModules.hasOwnProperty(dep)) {
				Util.error(_GError.ModuleMiss, '依赖模块' + dep + '不存在！');
			}
			deps[i] = _GModules[dep]();
		}

		_GModules[name] = function () {
			return impl.apply(impl, deps);
		};
	};
}